export interface Story {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    mainImage: string;
    publishedAt: string;
    author: string;
    isFeatured?: boolean;
}

export const stories: Story[] = [
    {
        id: '1',
        title: "Summer Fashion Trends 2026: Embrace the Heat",
        slug: "summer-fashion-trends-2026",
        excerpt: "Discover the hottest styles for the upcoming season, from breathable fabrics to bold prints that define summer.",
        category: "Trends",
        mainImage: "/assets/categories/womens_category.png", // Using existing placeholder
        publishedAt: "2026-06-15",
        author: "Sampada Style Team",
        isFeatured: true
    },
    {
        id: '2',
        title: "Behind the Scenes: Creating the 'Ashta Sampada' Collection",
        slug: "behind-the-scenes-ashta-sampada",
        excerpt: "Take a peek into our design process and see how we translate Vedic prosperity concepts into modern apparel.",
        category: "Behind-the-Scenes",
        mainImage: "/assets/categories/mens_category.png",
        publishedAt: "2026-05-20",
        author: "Binod S.",
        isFeatured: false
    },
    {
        id: '3',
        title: "5 Ways to Style Your Sampada Hoodie",
        slug: "5-ways-to-style-hoodie",
        excerpt: "From casual fridays to cozy weekends, learn versatile styling tips for our signature hoodies.",
        category: "Fashion",
        mainImage: "/assets/categories/home_category.png", // Placeholder
        publishedAt: "2026-05-10",
        author: "Fashion Editor",
        isFeatured: false
    },
    {
        id: '4',
        title: "Customer Spotlight: Living Abundantly",
        slug: "customer-spotlight-living-abundantly",
        excerpt: "Meet Sarah, an artist who uses our 'Prosperity' mug to start her day with positive intention.",
        category: "Customer Stories",
        mainImage: "/assets/categories/home_category.png",
        publishedAt: "2026-04-05",
        author: "Community Team",
        isFeatured: false
    },
    {
        id: '5',
        title: "The Science of Comfort: Our Fabric Choices",
        slug: "science-of-comfort",
        excerpt: "Why we choose specific cotton blends and how they contribute to your daily comfort and well-being.",
        category: "Product Stories",
        mainImage: "/assets/categories/mens_category.png",
        publishedAt: "2026-03-22",
        author: "Product Team",
        isFeatured: false
    }
];

export const categories = [
    "All",
    "Fashion",
    "Trends",
    "Behind-the-Scenes",
    "Product Stories",
    "Customer Stories"
];
