// Curated local businesses database for Il Buco chat assistant
// This data comes from our places-nearby pages and personal recommendations

export interface LocalBusiness {
  name: string;
  category: string;
  description: {
    es: string;
    en: string;
    pt: string;
  };
  location: 'carilo' | 'valeria' | 'pinamar' | 'mar_de_las_pampas';
  tags: string[]; // For search matching
}

export const LOCAL_BUSINESSES: LocalBusiness[] = [
  // === CARNICERÍAS / MEAT ===
  {
    name: 'Cabaña Guerrero',
    category: 'carniceria',
    description: {
      es: 'Mi carne favorita. Excelente calidad para asados.',
      en: 'My favorite meat shop. Excellent quality for BBQ.',
      pt: 'Minha carne favorita. Excelente qualidade para churrasco.',
    },
    location: 'carilo',
    tags: ['carne', 'asado', 'carniceria', 'meat', 'bbq', 'parrilla'],
  },

  // === VERDULERIAS / PRODUCE ===
  {
    name: 'Belén',
    category: 'verduleria',
    description: {
      es: 'Las mejores frutas y verduras de la zona.',
      en: 'Best fruit and vegetables in the area.',
      pt: 'As melhores frutas e vegetais da região.',
    },
    location: 'carilo',
    tags: ['frutas', 'verduras', 'vegetables', 'fruit', 'produce', 'verduleria'],
  },
  {
    name: 'Boutique de Frutas',
    category: 'verduleria',
    description: {
      es: 'Verdulería autoservicio. Productos baratos cerca de vencer. Económico y práctico.',
      en: 'Self-service greengrocer. Cheap products near expiration. Budget-friendly.',
      pt: 'Quitanda self-service. Produtos baratos perto de vencer. Econômico.',
    },
    location: 'carilo',
    tags: ['frutas', 'verduras', 'vegetables', 'fruit', 'barato', 'cheap', 'verduleria', 'autoservicio'],
  },

  // === PESCADERÍAS / FISH ===
  {
    name: 'La Constanza (Cariló)',
    category: 'pescaderia',
    description: {
      es: 'Pescado fresco, no congelado, incluso salmón. Cerrado en temporada baja.',
      en: 'Fresh fish, not frozen, even salmon. Closed in low season.',
      pt: 'Peixe fresco, não congelado, até salmão. Fechado na baixa temporada.',
    },
    location: 'carilo',
    tags: ['pescado', 'fish', 'salmon', 'mariscos', 'seafood', 'pescaderia', 'fresco'],
  },
  {
    name: 'La Constanza (Pinamar)',
    category: 'pescaderia',
    description: {
      es: 'Abierto durante temporada baja cuando la ubicación de Cariló está cerrada.',
      en: 'Open during low season when Cariló location is closed.',
      pt: 'Aberto na baixa temporada quando o local de Cariló está fechado.',
    },
    location: 'pinamar',
    tags: ['pescado', 'fish', 'salmon', 'mariscos', 'seafood', 'pescaderia'],
  },

  // === SUPERMERCADOS ===
  {
    name: 'Chicho',
    category: 'supermercado',
    description: {
      es: 'Los mejores horarios de apertura, frutas y verduras decentes.',
      en: 'Best opening hours, decent fruit and vegetables.',
      pt: 'Melhores horários, frutas e vegetais decentes.',
    },
    location: 'carilo',
    tags: ['supermercado', 'supermarket', 'mercado', 'grocery'],
  },
  {
    name: 'La Proveeduría / Menor Coste',
    category: 'supermercado',
    description: {
      es: 'Caro, mini Whole Foods. Productos premium.',
      en: 'Expensive, mini Whole Foods. Premium products.',
      pt: 'Caro, mini Whole Foods. Produtos premium.',
    },
    location: 'carilo',
    tags: ['supermercado', 'supermarket', 'premium', 'gourmet'],
  },
  {
    name: 'Coto',
    category: 'supermercado',
    description: {
      es: 'El supermercado grande más cercano. Tienen de todo: comida, muebles, bicicletas. Delivery a Cariló.',
      en: 'Closest big supermarket. Everything from food to furniture and bikes. Delivery to Cariló.',
      pt: 'Supermercado grande mais próximo. De tudo: comida, móveis, bicicletas. Entrega em Cariló.',
    },
    location: 'pinamar',
    tags: ['supermercado', 'supermarket', 'grande', 'delivery', 'envio'],
  },
  {
    name: 'Disco',
    category: 'supermercado',
    description: {
      es: 'Alternativa sin tomar la autopista. También hacen delivery a Cariló.',
      en: 'Alternative without taking the highway. Also delivers to Cariló.',
      pt: 'Alternativa sem pegar a estrada. Também entrega em Cariló.',
    },
    location: 'pinamar',
    tags: ['supermercado', 'supermarket', 'delivery', 'envio'],
  },

  // === PARRILLAS / BBQ RESTAURANTS ===
  {
    name: 'Parrilla Argentina',
    category: 'restaurante',
    description: {
      es: 'La mejor parrilla con muchos extras gratuitos.',
      en: 'Best BBQ with many free extras.',
      pt: 'Melhor churrasco com muitos extras grátis.',
    },
    location: 'carilo',
    tags: ['parrilla', 'asado', 'carne', 'restaurante', 'bbq', 'steak'],
  },
  {
    name: 'Don Benito',
    category: 'restaurante',
    description: {
      es: 'Parrilla elegante y sofisticada.',
      en: 'Elegant and sophisticated BBQ.',
      pt: 'Churrasco elegante e sofisticado.',
    },
    location: 'carilo',
    tags: ['parrilla', 'asado', 'carne', 'restaurante', 'elegante', 'bbq'],
  },
  {
    name: 'De Mi Campo',
    category: 'restaurante',
    description: {
      es: 'Destacado por su barra de ensaladas.',
      en: 'Known for its salad bar.',
      pt: 'Destaque para a barra de saladas.',
    },
    location: 'carilo',
    tags: ['parrilla', 'asado', 'ensaladas', 'restaurante', 'saludable'],
  },
  {
    name: 'La Parrillita',
    category: 'restaurante',
    description: {
      es: 'Básico en el buen sentido, auténtico.',
      en: 'Basic in a good way, authentic.',
      pt: 'Básico no bom sentido, autêntico.',
    },
    location: 'carilo',
    tags: ['parrilla', 'asado', 'autentico', 'restaurante', 'basico'],
  },

  // === PIZZA ===
  {
    name: 'Pizza Italiana',
    category: 'restaurante',
    description: {
      es: 'Pizza napolitana premiada de los chefs italianos.',
      en: 'Award-winning Neapolitan pizza from Italian chefs.',
      pt: 'Pizza napolitana premiada de chefs italianos.',
    },
    location: 'carilo',
    tags: ['pizza', 'italiano', 'restaurante', 'napolitana'],
  },

  // === HAMBURGUESAS ===
  {
    name: 'Hamburguesas Gourmet',
    category: 'restaurante',
    description: {
      es: 'Las mejores hamburguesas de Cariló.',
      en: 'Best burgers in Cariló.',
      pt: 'Melhores hambúrgueres de Cariló.',
    },
    location: 'carilo',
    tags: ['hamburguesa', 'burger', 'restaurante', 'gourmet'],
  },
  {
    name: 'Impeke',
    category: 'restaurante',
    description: {
      es: 'Hamburguesas gourmet destacadas en Valeria del Mar.',
      en: 'Outstanding gourmet burgers in Valeria del Mar.',
      pt: 'Hambúrgueres gourmet destacados em Valeria del Mar.',
    },
    location: 'valeria',
    tags: ['hamburguesa', 'burger', 'restaurante', 'gourmet'],
  },

  // === CAFETERÍAS ===
  {
    name: 'Panadería y Café',
    category: 'cafeteria',
    description: {
      es: 'Excelente café y productos horneados. La mejor tostada de palta.',
      en: 'Excellent coffee and baked goods. Best avocado toast.',
      pt: 'Excelente café e produtos de padaria. Melhor torrada de abacate.',
    },
    location: 'carilo',
    tags: ['cafe', 'panaderia', 'desayuno', 'breakfast', 'bakery', 'coffee'],
  },
  {
    name: 'Café Francés',
    category: 'cafeteria',
    description: {
      es: 'Siempre abierto, perfecto para cualquier momento.',
      en: 'Always open, perfect anytime.',
      pt: 'Sempre aberto, perfeito para qualquer momento.',
    },
    location: 'carilo',
    tags: ['cafe', 'coffee', 'abierto', 'desayuno'],
  },
  {
    name: 'Panettone',
    category: 'cafeteria',
    description: {
      es: 'Simple y confiable.',
      en: 'Simple and reliable.',
      pt: 'Simples e confiável.',
    },
    location: 'carilo',
    tags: ['cafe', 'panaderia', 'bakery'],
  },
  {
    name: 'Masse',
    category: 'cafeteria',
    description: {
      es: 'Panes elegantes con semillas.',
      en: 'Elegant breads with seeds.',
      pt: 'Pães elegantes com sementes.',
    },
    location: 'carilo',
    tags: ['panaderia', 'pan', 'bread', 'bakery', 'semillas'],
  },

  // === HELADERÍAS ===
  {
    name: 'Colonial',
    category: 'heladeria',
    description: {
      es: 'Mi helado favorito. En Valeria del Mar.',
      en: 'My favorite ice cream. In Valeria del Mar.',
      pt: 'Meu sorvete favorito. Em Valeria del Mar.',
    },
    location: 'valeria',
    tags: ['helado', 'ice cream', 'heladeria', 'postre', 'dessert'],
  },
  {
    name: "Lucciano's",
    category: 'heladeria',
    description: {
      es: 'El lugar más bonito para disfrutar helados.',
      en: 'The prettiest place to enjoy ice cream.',
      pt: 'O lugar mais bonito para tomar sorvete.',
    },
    location: 'carilo',
    tags: ['helado', 'ice cream', 'heladeria', 'postre', 'dessert'],
  },

  // === FERRETERÍA ===
  {
    name: 'Jorjito',
    category: 'ferreteria',
    description: {
      es: 'La ferretería más completa de la zona.',
      en: 'Most complete hardware store in the area.',
      pt: 'Ferragem mais completa da região.',
    },
    location: 'carilo',
    tags: ['ferreteria', 'hardware', 'herramientas', 'tools'],
  },

  // === LIMPIEZA ===
  {
    name: 'Quimica Limpia Maurito',
    category: 'limpieza',
    description: {
      es: 'Lo mejor para productos de limpieza al por mayor. Entregan a Cariló semanalmente.',
      en: 'Best for wholesale cleaning products. Weekly delivery to Cariló.',
      pt: 'Melhor para produtos de limpeza no atacado. Entrega semanal em Cariló.',
    },
    location: 'pinamar',
    tags: ['limpieza', 'cleaning', 'productos', 'mayorista', 'wholesale'],
  },

  // === ARTE Y CERÁMICA ===
  {
    name: 'Fusion Arte del Mar',
    category: 'actividad',
    description: {
      es: 'Clases de cerámica y arte en Valeria del Mar.',
      en: 'Ceramics and art classes in Valeria del Mar.',
      pt: 'Aulas de cerâmica e arte em Valeria del Mar.',
    },
    location: 'valeria',
    tags: ['ceramica', 'arte', 'clases', 'taller', 'ceramics', 'art', 'workshop'],
  },
];

// Search function for local businesses
export function searchLocalBusinessDatabase(query: string, language: 'es' | 'en' | 'pt' = 'es'): string {
  const queryLower = query.toLowerCase();

  // Common query mappings
  const queryMappings: Record<string, string[]> = {
    'carne': ['carne', 'carniceria', 'asado', 'meat'],
    'carniceria': ['carne', 'carniceria', 'asado', 'meat'],
    'asado': ['carne', 'carniceria', 'asado', 'parrilla'],
    'frutas': ['frutas', 'verduras', 'verduleria', 'produce'],
    'verduras': ['frutas', 'verduras', 'verduleria', 'produce'],
    'verduleria': ['frutas', 'verduras', 'verduleria', 'produce'],
    'pescado': ['pescado', 'pescaderia', 'fish', 'mariscos'],
    'supermercado': ['supermercado', 'supermarket', 'mercado'],
    'cafe': ['cafe', 'coffee', 'cafeteria', 'desayuno'],
    'pizza': ['pizza', 'italiano'],
    'hamburguesa': ['hamburguesa', 'burger'],
    'helado': ['helado', 'ice cream', 'heladeria'],
    'ferreteria': ['ferreteria', 'hardware', 'herramientas'],
    'restaurante': ['restaurante', 'parrilla', 'pizza', 'burger'],
    'parrilla': ['parrilla', 'asado', 'carne', 'bbq'],
  };

  // Expand query with mappings
  const searchTerms = queryMappings[queryLower] || [queryLower];

  // Find matching businesses
  const matches = LOCAL_BUSINESSES.filter(business =>
    searchTerms.some(term =>
      business.tags.some(tag => tag.includes(term) || term.includes(tag)) ||
      business.name.toLowerCase().includes(term) ||
      business.category.includes(term)
    )
  );

  if (matches.length === 0) {
    return ''; // No matches found in local database
  }

  // Format results
  const locationNames: Record<string, Record<string, string>> = {
    carilo: { es: 'Cariló', en: 'Cariló', pt: 'Cariló' },
    valeria: { es: 'Valeria del Mar', en: 'Valeria del Mar', pt: 'Valeria del Mar' },
    pinamar: { es: 'Pinamar', en: 'Pinamar', pt: 'Pinamar' },
    mar_de_las_pampas: { es: 'Mar de las Pampas', en: 'Mar de las Pampas', pt: 'Mar de las Pampas' },
  };

  const results = matches.map(b => {
    const loc = locationNames[b.location]?.[language] || b.location;
    return `**${b.name}** (${loc})\n${b.description[language]}`;
  });

  const header = {
    es: 'Estos son los lugares que recomendamos:',
    en: 'Here are the places we recommend:',
    pt: 'Aqui estão os lugares que recomendamos:',
  };

  return `${header[language]}\n\n${results.join('\n\n')}\n\n_Recomendaciones curadas de Il Buco_`;
}
