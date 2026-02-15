
import { client } from './client';

export const getStories = async () => {
    const query = `*[_type == "post"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        "category": categories[0]->name,
        isFeatured,
        publishedAt,
        author
    }`;
    const stories = await client.fetch(query);
    return stories;
};

export const getStoryBySlug = async (slug) => {
    const query = `*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        "category": categories[0]->name,
        isFeatured,
        publishedAt,
        body
    }`;
    const story = await client.fetch(query, { slug });
    return story;
};
