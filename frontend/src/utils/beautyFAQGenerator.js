class BeautyFAQGenerator {
  generateProductFAQ(product) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `How do I use ${product.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": product.usage_instructions
          }
        },
        {
          "@type": "Question",
          "name": `What skin types is ${product.name} suitable for?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": product.skin_type_compatibility
          }
        },
        {
          "@type": "Question",
          "name": `What are the main ingredients in ${product.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": product.key_ingredients
          }
        },
        {
          "@type": "Question",
          "name": `How long does ${product.name} last?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": product.duration_info
          }
        }
      ]
    };
  }

  generateLookFAQ(look) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What products do I need for this ${look.name} look?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": look.required_products.join(", ")
          }
        },
        {
          "@type": "Question",
          "name": "How long does this look take to create?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": look.estimated_time
          }
        }
      ]
    };
  }

  generateSkincareFAQ(routine) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What order should I apply these products?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": routine.application_order
          }
        },
        {
          "@type": "Question",
          "name": "When should I use this routine?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": routine.timing_instructions
          }
        }
      ]
    };
  }
}

export const beautyFAQGenerator = new BeautyFAQGenerator();
export default beautyFAQGenerator;
