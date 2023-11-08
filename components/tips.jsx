const tips = [
  {
    title: "Companion Planting",
    description:
      "Explore which plants thrive when planted together, benefiting each other’s growth and deterring pests.",
  },
  {
    title: "Soil Health",
    description:
      "Maintain soil fertility with compost, organic matter, and regular aerating to promote healthy plant growth.",
  },
  {
    title: "Mulching",
    description:
      "Use mulch to suppress weeds, retain soil moisture, and regulate soil temperature for optimal plant health.",
  },
  {
    title: "Crop Rotation",
    description:
      "Rotate plant families annually to prevent soil depletion and minimize pest and disease problems.",
  },
  {
    title: "Watering Techniques",
    description:
      "Water plants deeply and less frequently to encourage deep root growth, avoiding shallow root systems.",
  },
  {
    title: "Sunlight Exposure",
    description:
      "Understand the sunlight needs of your plants and position them accordingly for optimal growth.",
  },
  {
    title: "Pruning and Trimming",
    description:
      "Regularly prune dead or diseased branches to promote healthy growth and shape plants for better aesthetics.",
  },
  {
    title: "Raised Beds",
    description:
      "Consider raised beds for improved drainage, better soil quality, and easier gardening access.",
  },
  {
    title: "Container Gardening",
    description:
      "Utilize containers for plants, enabling flexibility in placement and ideal for small spaces or urban gardening.",
  },
  {
    title: "Organic Pest Control",
    description:
      "Implement natural pest deterrents like neem oil, companion planting, or introducing beneficial insects.",
  },
  {
    title: "Herb Gardening",
    description:
      "Grow herbs for culinary use, health benefits, and to naturally repel certain pests in the garden.",
  },
  {
    title: "Seasonal Planting",
    description:
      "Understand the best seasons for planting different types of crops or flowers for optimal growth.",
  },
  {
    title: "Weeding",
    description:
      "Regularly remove weeds to prevent competition for resources and reduce pest and disease issues.",
  },
  {
    title: "Composting",
    description:
      "Start a compost pile to recycle organic waste, providing nutrient-rich soil amendment for your garden.",
  },
  {
    title: "Water Conservation",
    description:
      "Implement water-saving techniques like drip irrigation, rain barrels, or selecting drought-resistant plants.",
  },
  {
    title: "Fertilization",
    description:
      "Apply the right fertilizers at the right time to provide essential nutrients for healthy plant growth.",
  },
  {
    title: "Seed Selection",
    description:
      "Choose high-quality seeds suited for your climate and soil conditions to ensure successful germination.",
  },
  {
    title: "Tool Maintenance",
    description:
      "Regularly clean and maintain gardening tools to ensure efficiency and prevent the spread of diseases.",
  },
  {
    title: "Garden Layout",
    description:
      "Plan and design your garden layout to optimize space, sunlight, and visual appeal.",
  },
  {
    title: "Winterizing Plants",
    description:
      "Prepare plants for winter by protecting them from frost or bringing sensitive plants indoors.",
  },
  {
    title: "Pollinator Plants",
    description:
      "Incorporate pollinator-friendly plants to attract bees, butterflies, and other beneficial insects.",
  },
  {
    title: "Vertical Gardening",
    description:
      "Maximize space by growing plants vertically on trellises, walls, or other supports.",
  },
  {
    title: "Integrated Pest Management",
    description:
      "Adopt a holistic approach to pest management, focusing on prevention and eco-friendly solutions.",
  },
  {
    title: "pH Testing",
    description:
      "Regularly test soil pH and adjust it as necessary to provide an ideal environment for plant growth.",
  },
  {
    title: "Indoor Gardening",
    description:
      "Grow plants indoors for better air quality, aesthetics, and the joy of gardening all year round.",
  },
  {
    title: "Shade Gardening",
    description:
      "Select shade-tolerant plants and design the garden to thrive in low-light conditions.",
  },
  {
    title: "Harvesting Techniques",
    description:
      "Learn the proper harvesting methods to ensure peak flavor and encourage continuous growth.",
  },
  {
    title: "Permaculture Principles",
    description:
      "Implement permaculture strategies to create self-sustaining and harmonious garden ecosystems.",
  },
  {
    title: "Beneficial Microorganisms",
    description:
      "Encourage the growth of beneficial soil microbes for healthier plants and improved soil structure.",
  },
  {
    title: "Hydroponic Gardening",
    description:
      "Explore hydroponic systems for growing plants without soil, using nutrient-rich water solutions.",
  },
  {
    title: "Frost Protection",
    description:
      "Protect sensitive plants from frost by covering them or using frost cloth during cold weather.",
  },
  {
    title: "Air Pruning",
    description:
      "Consider air-pruning containers to prevent root circling and promote healthier root systems.",
  },
  {
    title: "Garden Maintenance Schedule",
    description:
      "Create a maintenance plan for regular tasks such as weeding, watering, and plant care.",
  },
  {
    title: "Disease Prevention",
    description:
      "Practice good garden hygiene and identify early signs of disease to prevent its spread.",
  },
  {
    title: "Natural Deterrents",
    description:
      "Use natural deterrents like garlic spray or pepper solutions to repel pests.",
  },
  {
    title: "Edible Landscaping",
    description:
      "Blend edible plants into your landscape for both aesthetics and a homegrown food source.",
  },
  {
    title: "Beekeeping Benefits",
    description:
      "Consider beekeeping to support pollination, honey production, and overall garden health.",
  },
  {
    title: "Season Extension Techniques",
    description:
      "Extend the growing season with techniques like row covers or cold frames for earlier planting.",
  },
  {
    title: "Japanese Gardening",
    description:
      "Incorporate principles of Japanese gardening for tranquility, simplicity, and harmony in your garden.",
  },
  {
    title: "Aquaponics",
    description:
      "Explore aquaponic systems that combine aquaculture and hydroponics for sustainable gardening.",
  },
  {
    title: "Drought-Tolerant Landscaping",
    description:
      "Opt for plants that are naturally adapted to drought conditions, reducing water requirements.",
  },
  {
    title: "Garden Record Keeping",
    description:
      "Maintain a gardening journal to track successes, failures, and learnings for future reference.",
  },
  {
    title: "Windbreaks",
    description:
      "Create windbreaks using trees or structures to protect plants from strong winds.",
  },
  {
    title: "Rock Gardening",
    description:
      "Design and plant in rock gardens, utilizing well-draining soil and appropriate plants.",
  },
  {
    title: "Art in the Garden",
    description:
      "Incorporate sculptures, decorative elements, or mosaics to add artistic elements to the garden.",
  },
  {
    title: "Hugelkultur",
    description:
      "Build raised beds using organic materials for long-term soil improvement and moisture retention.",
  },
  {
    title: "Espalier Techniques",
    description:
      "Train fruit trees to grow flat against a wall or fence using espalier techniques.",
  },
  {
    title: "Companion Planting Charts",
    description:
      "Refer to companion planting charts for guidance on beneficial plant groupings.",
  },
  {
    title: "Bonsai Gardening",
    description:
      "Explore the art of bonsai, cultivating miniature trees for aesthetics and patience.",
  },
  {
    title: "Perennial vs. Annual Plants",
    description:
      "Understand the differences between perennial and annual plants and their role in the garden.",
  },
  {
    title: "Beneficial Insects",
    description:
      "Attract beneficial insects like ladybugs or lacewings to control pest populations.",
  },
  {
    title: "Potted Fruit Trees",
    description:
      "Grow fruit trees in containers for convenience, mobility, and suitability in limited spaces.",
  },
  {
    title: "Lasagna Gardening",
    description:
      "Adopt the lasagna gardening technique, layering organic materials for fertile soil beds.",
  },
  {
    title: "Seed Saving",
    description:
      "Save seeds from open-pollinated plants to propagate next season’s crops.",
  },
  {
    title: "Seedling Care",
    description:
      "Provide proper care to seedlings, ensuring they have adequate light, moisture, and nutrients.",
  },
  {
    title: "Garden Aesthetics",
    description:
      "Consider the aesthetic appeal of your garden through color schemes, shapes, and textures.",
  },
  {
    title: "Pollination Strategies",
    description:
      "Understand different plant pollination methods and how to encourage successful pollination.",
  },
  {
    title: "Garden Sanctuaries",
    description:
      "Create peaceful garden spaces for relaxation, meditation, and overall mental well-being.",
  },
  {
    title: "Indigenous Planting",
    description:
      "Opt for native plants that are adapted to your region for low maintenance and ecosystem support.",
  },
  {
    title: "Seed Germination",
    description:
      "Provide optimal conditions for seed germination, including moisture, warmth, and suitable soil.",
  },
  {
    title: "Community Gardens",
    description:
      "Join or start a community garden for shared resources, knowledge exchange, and social interaction.",
  },
  {
    title: "Greenhouse Gardening",
    description:
      "Utilize greenhouses for controlled environments, extended seasons, and growing delicate plants.",
  },
  {
    title: "Seedling Hardening",
    description:
      "Harden off seedlings gradually before transplanting to adapt them to outdoor conditions.",
  },
  {
    title: "Invasive Species Awareness",
    description:
      "Identify and prevent invasive species from harming the garden ecosystem.",
  },
  {
    title: "Dry Gardening",
    description:
      "Opt for drought-tolerant plants and designs to minimize water usage in gardening.",
  },
  {
    title: "Pest Identification",
    description:
      "Learn to identify garden pests accurately to implement suitable control methods.",
  },
  {
    title: "Garden Planning Apps",
    description:
      "Utilize gardening apps or software for planning, tracking, and obtaining gardening advice.",
  },
  {
    title: "Grafting Techniques",
    description:
      "Learn grafting techniques to combine different plants for beneficial traits or propagation.",
  },
  {
    title: "Seed Starting Mix",
    description:
      "Prepare or buy a high-quality seed starting mix for successful seed germination.",
  },
  {
    title: "Garden Feng Shui",
    description:
      "Apply principles of Feng Shui in garden design for balance, harmony, and positive energy flow.",
  },
  {
    title: "Garden Educators and Workshops",
    description:
      "Attend workshops or seek guidance from expert gardeners for learning and skill enhancement.",
  },
  {
    title: "Square Foot Gardening",
    description:
      "Optimize garden space and productivity using the square foot gardening technique.",
  },
  {
    title: "Terrariums and Miniature Gardens",
    description:
      "Create terrariums or miniature gardens for small-scale indoor plant displays.",
  },
  {
    title: "Vermicomposting",
    description:
      "Use worms for composting, turning kitchen scraps into nutrient-rich vermicompost.",
  },
  {
    title: "Garden Tool Selection",
    description:
      "Select appropriate tools for different gardening tasks to make the work easier and more efficient.",
  },
  {
    title: "Aquatic Gardening",
    description:
      "Explore aquatic gardening, growing plants in water, and creating water features.",
  },
  {
    title: "Shrubs and Trees Pruning",
    description:
      "Prune shrubs and trees to encourage healthy growth and maintain desired shapes.",
  },
  {
    title: "Garden Photography",
    description:
      "Capture the beauty of your garden with photography, documenting progress and plant varieties.",
  },
  {
    title: "Sensory Gardens",
    description:
      "Design gardens that engage the senses, incorporating scents, textures, and visual appeal.",
  },
  {
    title: "Seedling Transplanting",
    description:
      "Transplant seedlings carefully, ensuring minimal shock and disturbance to their root systems.",
  },
  {
    title: "Garden Pest Predators",
    description:
      "Attract and protect natural pest predators like birds to control pest populations.",
  },
  {
    title: "Bamboo Gardening",
    description:
      "Utilize bamboo for ornamental purposes, privacy screens, and versatile garden structures.",
  },
  {
    title: "Garden Safety",
    description:
      "Adhere to safety practices to prevent injuries while using tools or working in the garden.",
  },
  {
    title: "Healing Gardens",
    description:
      "Create therapeutic gardens, promoting healing and relaxation for mental and physical well-being.",
  },
  {
    title: "Landscaping with Rocks",
    description:
      "Incorporate rocks in landscaping for aesthetic appeal, erosion control, and unique garden features.",
  },
  {
    title: "Ornamental Grasses",
    description:
      "Plant ornamental grasses for texture, movement, and low-maintenance garden interest.",
  },
  {
    title: "Garden Critter Deterrents",
    description:
      "Use physical barriers or repellents to deter critters that can damage the garden.",
  },
  {
    title: "Garden Signage",
    description:
      "Create signs or labels for your garden to identify plants, share information, and add visual interest.",
  },
  {
    title: "Garden Shade Structures",
    description:
      "Install shade structures like pergolas or arbors for protection and aesthetic enhancement.",
  },
  {
    title: "Balcony and Small Space Gardening",
    description:
      "Optimize small spaces for gardening, using vertical gardening or container gardening techniques.",
  },
  {
    title: "Garden Meditation Areas",
    description:
      "Design spaces within the garden for meditation, relaxation, and mental rejuvenation.",
  },
];

export function getRandomTip() {
  return tips[Math.floor(Math.random() * tips.length)];
}
