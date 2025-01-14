from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import face_recognition
from PIL import Image
import io
import base64
import json
from datetime import datetime, timedelta
import jwt
import bcrypt
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['makeup_app']

# JWT configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_EXPIRATION = timedelta(days=1)

# Virtual Try-On endpoints
@app.route('/api/virtual-tryon/process', methods=['POST'])
def process_virtual_tryon():
    try:
        data = request.json
        image_data = base64.b64decode(data['image'].split(',')[1])
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to OpenCV format
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Detect face landmarks
        face_locations = face_recognition.face_locations(cv_image)
        face_landmarks = face_recognition.face_landmarks(cv_image, face_locations)
        
        if not face_landmarks:
            return jsonify({'error': 'No face detected'}), 400
        
        # Apply virtual makeup based on product type
        result_image = apply_virtual_makeup(cv_image, face_landmarks[0], data['product'])
        
        # Convert back to base64
        _, buffer = cv2.imencode('.png', result_image)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({'image': f'data:image/png;base64,{image_base64}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def apply_virtual_makeup(image, landmarks, product):
    if product['type'] == 'lipstick':
        return apply_lipstick(image, landmarks, product['color'])
    elif product['type'] == 'foundation':
        return apply_foundation(image, landmarks, product['color'])
    # Add more product types as needed
    return image

def apply_lipstick(image, landmarks, color):
    mask = np.zeros_like(image)
    points = np.array(landmarks['top_lip'] + landmarks['bottom_lip'])
    cv2.fillPoly(mask, [points], color)
    return cv2.addWeighted(image, 1, mask, 0.5, 0)

def apply_foundation(image, landmarks, color):
    mask = np.zeros_like(image)
    points = np.array(landmarks['chin'] + landmarks['left_eyebrow'] + 
                     landmarks['right_eyebrow'][::-1])
    cv2.fillPoly(mask, [points], color)
    return cv2.addWeighted(image, 1, mask, 0.3, 0)

# User Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        if db.users.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already exists'}), 400
        
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        user = {
            'email': data['email'],
            'password': hashed_password,
            'preferences': data.get('preferences', {}),
            'created_at': datetime.utcnow()
        }
        
        db.users.insert_one(user)
        return jsonify({'message': 'User registered successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = db.users.find_one({'email': data['email']})
        
        if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + JWT_EXPIRATION
        }, JWT_SECRET)
        
        return jsonify({'token': token})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Quiz and Recommendations endpoints
@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    try:
        data = request.json
        token = request.headers.get('Authorization').split(' ')[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        quiz_result = {
            'user_id': payload['user_id'],
            'answers': data['answers'],
            'created_at': datetime.utcnow()
        }
        
        db.quiz_results.insert_one(quiz_result)
        recommendations = generate_recommendations(data['answers'])
        
        return jsonify({'recommendations': recommendations})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_recommendations(answers):
    recommendations = {
        'products': [],
        'looks': [],
        'tips': []
    }
    
    # Add product recommendations based on skin type
    if answers.get('skin_type') == 'dry':
        recommendations['products'].extend([
            {'name': 'Hydrating Foundation', 'type': 'foundation'},
            {'name': 'Cream Blush', 'type': 'blush'}
        ])
    elif answers.get('skin_type') == 'oily':
        recommendations['products'].extend([
            {'name': 'Oil-Free Foundation', 'type': 'foundation'},
            {'name': 'Powder Blush', 'type': 'blush'}
        ])
    
    # Add look recommendations based on preferences
    if answers.get('style') == 'natural':
        recommendations['looks'].append({
            'name': 'Fresh Face Glow',
            'products': ['Tinted Moisturizer', 'Cream Blush']
        })
    elif answers.get('style') == 'glam':
        recommendations['looks'].append({
            'name': 'Sultry Night Out',
            'products': ['Full Coverage Foundation', 'Smokey Eye Palette']
        })
    
    return recommendations

# Ingredient Information endpoints
@app.route('/api/ingredients/search', methods=['GET'])
def search_ingredients():
    try:
        query = request.args.get('q', '').lower()
        view = request.args.get('view', 'benefits')
        
        ingredients = list(db.ingredients.find({
            '$or': [
                {'name': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}},
                {'benefits': {'$regex': query, '$options': 'i'}}
            ]
        }))
        
        # Organize by view type
        if view == 'benefits':
            organized = {}
            for ingredient in ingredients:
                for benefit in ingredient['benefits']:
                    if benefit not in organized:
                        organized[benefit] = []
                    organized[benefit].append(ingredient)
            return jsonify(organized)
        else:
            return jsonify(ingredients)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
