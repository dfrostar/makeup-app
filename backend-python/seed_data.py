from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['makeup_app']

# Seed ingredient data
ingredients = [
    {
        'name': 'Hyaluronic Acid',
        'description': 'A powerful humectant that can hold up to 1000x its weight in water.',
        'benefits': ['Hydrating', 'Anti-aging', 'Plumping'],
        'commonly_paired': ['Vitamin C', 'Peptides', 'Niacinamide'],
        'type': 'Humectant',
        'safety_rating': 1,  # 1-5 scale, 1 being safest
        'created_at': datetime.utcnow()
    },
    {
        'name': 'Vitamin C',
        'description': 'A potent antioxidant that helps brighten skin and boost collagen production.',
        'benefits': ['Brightening', 'Anti-aging', 'Protection'],
        'commonly_paired': ['Vitamin E', 'Ferulic Acid', 'Hyaluronic Acid'],
        'type': 'Antioxidant',
        'safety_rating': 1,
        'created_at': datetime.utcnow()
    },
    {
        'name': 'Niacinamide',
        'description': 'A form of vitamin B3 that helps improve skin barrier function and reduce inflammation.',
        'benefits': ['Pore-refining', 'Oil-control', 'Brightening'],
        'commonly_paired': ['Hyaluronic Acid', 'Zinc', 'Peptides'],
        'type': 'Vitamin',
        'safety_rating': 1,
        'created_at': datetime.utcnow()
    }
]

# Seed product data
products = [
    {
        'name': 'Luminous Foundation',
        'type': 'foundation',
        'description': 'A lightweight, buildable foundation with a natural finish.',
        'ingredients': ['Hyaluronic Acid', 'Vitamin E'],
        'shades': [
            {'name': 'Fair', 'hex': '#F5DEB3'},
            {'name': 'Medium', 'hex': '#DEB887'},
            {'name': 'Deep', 'hex': '#8B4513'}
        ],
        'sustainability': {
            'packaging': 'Recyclable glass bottle',
            'recycling_instructions': ['Remove pump', 'Rinse bottle', 'Recycle with glass'],
            'score': 85
        },
        'created_at': datetime.utcnow()
    },
    {
        'name': 'Matte Lipstick',
        'type': 'lipstick',
        'description': 'Long-wearing matte lipstick with intense color payoff.',
        'ingredients': ['Vitamin E', 'Jojoba Oil'],
        'shades': [
            {'name': 'Classic Red', 'hex': '#FF0000'},
            {'name': 'Pink Rose', 'hex': '#FF69B4'},
            {'name': 'Mauve', 'hex': '#E0B0FF'}
        ],
        'sustainability': {
            'packaging': 'Refillable metal tube',
            'recycling_instructions': ['Keep metal tube', 'Purchase refill', 'Recycle old insert'],
            'score': 90
        },
        'created_at': datetime.utcnow()
    }
]

# Seed looks data
looks = [
    {
        'name': 'Fresh Face Glow',
        'category': 'natural',
        'description': 'A natural, dewy look perfect for everyday wear.',
        'products': [
            {'name': 'Tinted Moisturizer', 'type': 'foundation'},
            {'name': 'Cream Blush', 'type': 'blush'},
            {'name': 'Clear Brow Gel', 'type': 'brow'},
            {'name': 'Lip Oil', 'type': 'lip'}
        ],
        'tutorial_steps': [
            {'step': 1, 'description': 'Apply tinted moisturizer with fingers'},
            {'step': 2, 'description': 'Dab cream blush on cheeks and blend'},
            {'step': 3, 'description': 'Brush through brows with clear gel'},
            {'step': 4, 'description': 'Finish with lip oil'}
        ],
        'created_at': datetime.utcnow()
    },
    {
        'name': 'Sultry Night Out',
        'category': 'glam',
        'description': 'A dramatic evening look with smokey eyes.',
        'products': [
            {'name': 'Full Coverage Foundation', 'type': 'foundation'},
            {'name': 'Smokey Eye Palette', 'type': 'eye'},
            {'name': 'False Lashes', 'type': 'eye'},
            {'name': 'Metallic Highlighter', 'type': 'highlight'}
        ],
        'tutorial_steps': [
            {'step': 1, 'description': 'Apply foundation with beauty sponge'},
            {'step': 2, 'description': 'Create smokey eye with palette'},
            {'step': 3, 'description': 'Apply false lashes'},
            {'step': 4, 'description': 'Add highlighter to high points'}
        ],
        'created_at': datetime.utcnow()
    }
]

# Clear existing data
db.ingredients.delete_many({})
db.products.delete_many({})
db.looks.delete_many({})

# Insert new data
db.ingredients.insert_many(ingredients)
db.products.insert_many(products)
db.looks.insert_many(looks)

print('Database seeded successfully!')
