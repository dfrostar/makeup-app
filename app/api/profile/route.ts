import { NextResponse } from 'next/server';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
const profilesFile = path.join(dataDir, 'profiles.json');

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Initialize profiles file if it doesn't exist
if (!existsSync(profilesFile)) {
  writeFileSync(profilesFile, JSON.stringify({}), 'utf-8');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user1'; // Default to user1 for now
    
    const profiles = JSON.parse(readFileSync(profilesFile, 'utf-8'));
    const userProfile = profiles[userId] || null;
    
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const profileData = await request.json();
    const userId = 'user1'; // Default to user1 for now
    
    // Load existing profiles
    const profiles = JSON.parse(readFileSync(profilesFile, 'utf-8'));
    
    // Update the user's profile
    profiles[userId] = {
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    
    // Save profiles back to file
    writeFileSync(profilesFile, JSON.stringify(profiles, null, 2), 'utf-8');
    
    return NextResponse.json(profiles[userId], { status: 201 });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const updateData = await request.json();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user1'; // Default to user1 for now
    
    // Load existing profiles
    const profiles = JSON.parse(readFileSync(profilesFile, 'utf-8'));
    
    // Ensure the user's profile exists
    if (!profiles[userId]) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Update the profile with the new data
    profiles[userId] = {
      ...profiles[userId],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Save profiles back to file
    writeFileSync(profilesFile, JSON.stringify(profiles, null, 2), 'utf-8');
    
    return NextResponse.json(profiles[userId]);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 