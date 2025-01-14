class BeautyBreadcrumbs {
  generateBreadcrumbs(path) {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [];
    let currentPath = '';

    // Add home
    breadcrumbs.push({
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://makeupdir.com"
    });

    // Add each path segment
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": this.formatBreadcrumbName(segment),
        "item": `https://makeupdir.com${currentPath}`
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    };
  }

  formatBreadcrumbName(segment) {
    // Convert URL-friendly strings to display names
    const beautyCategoryNames = {
      'face': 'Face Makeup',
      'eyes': 'Eye Makeup',
      'lips': 'Lip Products',
      'skincare': 'Skincare',
      'tools': 'Makeup Tools',
      'tutorials': 'Beauty Tutorials',
      'looks': 'Makeup Looks',
      'brands': 'Beauty Brands'
    };

    return beautyCategoryNames[segment] || 
           segment.split('-')
                 .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                 .join(' ');
  }

  generateProductBreadcrumbs(product) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://makeupdir.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": this.formatBreadcrumbName(product.category),
          "item": `https://makeupdir.com/${product.category}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": this.formatBreadcrumbName(product.subcategory),
          "item": `https://makeupdir.com/${product.category}/${product.subcategory}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": product.name,
          "item": `https://makeupdir.com/${product.category}/${product.subcategory}/${product.slug}`
        }
      ]
    };
  }
}

export const beautyBreadcrumbs = new BeautyBreadcrumbs();
export default beautyBreadcrumbs;
