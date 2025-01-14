class BeautyIngredientGraph {
  generateIngredientSchema(ingredient) {
    return {
      "@context": "https://schema.org",
      "@type": "ChemicalSubstance",
      "name": ingredient.name,
      "description": ingredient.description,
      "image": ingredient.image,
      "chemicalRole": ingredient.roles,
      "safetyConsideration": ingredient.safetyInfo,
      "potentialAction": {
        "@type": "TreatAction",
        "target": ingredient.skinConcerns
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "EWG Rating",
          "value": ingredient.ewgRating
        },
        {
          "@type": "PropertyValue",
          "name": "Comedogenic Rating",
          "value": ingredient.comedogenicRating
        },
        {
          "@type": "PropertyValue",
          "name": "Source",
          "value": ingredient.source
        }
      ],
      "interactionCount": ingredient.researchPapers?.length || 0,
      "study": ingredient.researchPapers?.map(paper => ({
        "@type": "MedicalScholarlyArticle",
        "headline": paper.title,
        "author": paper.authors,
        "datePublished": paper.publishDate,
        "url": paper.url
      }))
    };
  }

  generateFormulationSchema(formulation) {
    return {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": formulation.name,
      "description": formulation.description,
      "recipeCategory": "Cosmetic Formulation",
      "ingredients": formulation.ingredients.map(ing => ({
        "@type": "IngredientUsage",
        "ingredient": {
          "@type": "ChemicalSubstance",
          "name": ing.name
        },
        "amount": ing.percentage,
        "purpose": ing.purpose
      })),
      "prepTime": formulation.preparationTime,
      "totalTime": formulation.totalTime,
      "yield": formulation.yield,
      "tool": formulation.equipment,
      "step": formulation.steps.map(step => ({
        "@type": "HowToStep",
        "name": step.title,
        "text": step.instructions,
        "image": step.image
      })),
      "nutrition": {
        "@type": "NutritionInformation",
        "skinType": formulation.suitableSkinTypes,
        "concerns": formulation.targetedConcerns
      }
    };
  }

  generateSkincareConcernSchema(concern) {
    return {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      "name": concern.name,
      "description": concern.description,
      "possibleTreatment": concern.treatments.map(treatment => ({
        "@type": "Drug",
        "name": treatment.ingredient,
        "activeIngredient": treatment.activeComponent,
        "recommendedIntake": treatment.usage,
        "warning": treatment.precautions
      })),
      "relevantSpecialty": {
        "@type": "MedicalSpecialty",
        "name": "Dermatology"
      }
    };
  }
}

export const beautyIngredientGraph = new BeautyIngredientGraph();
export default beautyIngredientGraph;
