"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Beauty profile data type
interface BeautyProfile {
  skinType: string;
  skinConcerns: string[];
  hairType: string;
  hairConcerns: string[];
  makeupStyle: string;
  productPreferences: string[];
  allergies: string[];
  seasonalPreference: string;
  timeAvailable: string;
}

export default function BeautyProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [profile, setProfile] = useState<BeautyProfile>({
    skinType: '',
    skinConcerns: [],
    hairType: '',
    hairConcerns: [],
    makeupStyle: '',
    productPreferences: [],
    allergies: [],
    seasonalPreference: 'all',
    timeAvailable: 'medium'
  });
  
  // Form options
  const skinTypes = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'];
  const skinConcerns = ['Acne', 'Aging', 'Dullness', 'Hyperpigmentation', 'Redness', 'Texture', 'Dryness'];
  const hairTypes = ['Straight', 'Wavy', 'Curly', 'Coily', 'Fine', 'Medium', 'Thick'];
  const hairConcerns = ['Dryness', 'Frizz', 'Damage', 'Thinning', 'Dandruff', 'Color Protection'];
  const makeupStyles = ['Natural', 'Glam', 'Bold', 'Minimal', 'Editorial', 'Classic'];
  const productPreferences = ['Clean Beauty', 'Cruelty-Free', 'Vegan', 'Fragrance-Free', 'Organic', 'Drugstore', 'Luxury'];
  const timeOptions = [
    { value: 'minimal', label: '5 minutes or less' },
    { value: 'short', label: '5-10 minutes' },
    { value: 'medium', label: '10-20 minutes' },
    { value: 'extended', label: '20+ minutes' }
  ];
  
  // Form update handlers
  const handleSingleSelect = (field: keyof BeautyProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const handleMultiSelect = (field: keyof BeautyProfile, value: string) => {
    setProfile(prev => {
      const currentValues = prev[field] as string[];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };
  
  // Navigation functions
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Save profile data to API
      await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      // Navigate to next onboarding step
      router.push('/onboarding/categories');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('There was a problem saving your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-rose-600 bg-rose-200">
                Step {step} of 4
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-rose-600">
                {Math.round((step / 4) * 100)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-rose-200">
            <div style={{ width: `${(step / 4) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-rose-500 to-pink-500"></div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Skin Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Your Skin Profile</h2>
              <p className="text-gray-600">Help us understand your skin to recommend appropriate beauty tasks</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is your skin type?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skinTypes.map(type => (
                  <div 
                    key={type}
                    onClick={() => handleSingleSelect('skinType', type)}
                    className={`
                      px-4 py-3 border rounded-lg text-center cursor-pointer transition
                      ${profile.skinType === type 
                        ? 'border-rose-500 bg-rose-50 text-rose-700' 
                        : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'}
                    `}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are your skin concerns? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skinConcerns.map(concern => (
                  <div 
                    key={concern}
                    onClick={() => handleMultiSelect('skinConcerns', concern)}
                    className={`
                      px-4 py-3 border rounded-lg text-center cursor-pointer transition
                      ${profile.skinConcerns.includes(concern) 
                        ? 'border-rose-500 bg-rose-50 text-rose-700' 
                        : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'}
                    `}
                  >
                    {concern}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-gray-500 text-sm mt-4">
              <p>This information helps us recommend appropriate skincare tasks and routines tailored to your needs.</p>
            </div>
          </div>
        )}
        
        {/* Step 2: Hair Profile */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Your Hair Profile</h2>
              <p className="text-gray-600">Tell us about your hair to customize hair care recommendations</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is your hair type?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hairTypes.map(type => (
                  <div 
                    key={type}
                    onClick={() => handleSingleSelect('hairType', type)}
                    className={`
                      px-4 py-3 border rounded-lg text-center cursor-pointer transition
                      ${profile.hairType === type 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'}
                    `}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are your hair concerns? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hairConcerns.map(concern => (
                  <div 
                    key={concern}
                    onClick={() => handleMultiSelect('hairConcerns', concern)}
                    className={`
                      px-4 py-3 border rounded-lg text-center cursor-pointer transition
                      ${profile.hairConcerns.includes(concern) 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'}
                    `}
                  >
                    {concern}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Makeup & Product Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Makeup & Product Preferences</h2>
              <p className="text-gray-600">Help us understand your style and product preferences</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What makeup style do you prefer?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {makeupStyles.map(style => (
                  <div 
                    key={style}
                    onClick={() => handleSingleSelect('makeupStyle', style)}
                    className={`
                      px-4 py-3 border rounded-lg text-center cursor-pointer transition
                      ${profile.makeupStyle === style 
                        ? 'border-pink-500 bg-pink-50 text-pink-700' 
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'}
                    `}
                  >
                    {style}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have any product preferences? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {productPreferences.map(preference => (
                  <div 
                    key={preference}
                    onClick={() => handleMultiSelect('productPreferences', preference)}
                    className={`
                      px-4 py-3 border rounded-lg text-center cursor-pointer transition
                      ${profile.productPreferences.includes(preference) 
                        ? 'border-pink-500 bg-pink-50 text-pink-700' 
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'}
                    `}
                  >
                    {preference}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Final Details */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Final Details</h2>
              <p className="text-gray-600">Almost done! Just a few more details to personalize your experience</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have any allergies or sensitivities? (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="E.g., Fragrance, Parabens, Sulfates"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        handleMultiSelect('allergies', value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  aria-label="Enter allergies or sensitivities"
                />
                <div className="text-xs text-gray-500 mt-1">Press Enter to add each item</div>
                
                {profile.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.allergies.map((item, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                      >
                        {item}
                        <button 
                          type="button"
                          onClick={() => handleMultiSelect('allergies', item)}
                          className="ml-1 inline-flex text-red-500 focus:outline-none"
                          aria-label={`Remove ${item}`}
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How much time do you typically have for beauty routines?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {timeOptions.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => handleSingleSelect('timeAvailable', option.value)}
                    className={`
                      px-4 py-3 border rounded-lg text-center cursor-pointer transition
                      ${profile.timeAvailable === option.value 
                        ? 'border-teal-500 bg-teal-50 text-teal-700' 
                        : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'}
                    `}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="seasonalPreference" className="block text-sm font-medium text-gray-700 mb-2">
                We'll help adjust your beauty tasks for seasonal changes
              </label>
              <select
                id="seasonalPreference"
                value={profile.seasonalPreference}
                onChange={(e) => handleSingleSelect('seasonalPreference', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                aria-label="Select seasonal preference"
              >
                <option value="all">All Seasons (I'll update manually)</option>
                <option value="auto">Automatically Adjust for My Current Season</option>
                <option value="spring">Focus on Spring Routines</option>
                <option value="summer">Focus on Summer Routines</option>
                <option value="fall">Focus on Fall Routines</option>
                <option value="winter">Focus on Winter Routines</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition"
              aria-label="Go back to previous step"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-md hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition"
              aria-label="Continue to next step"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-md hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition disabled:opacity-70"
              aria-label="Complete profile setup"
            >
              {saving ? 'Saving...' : 'Complete Profile'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 