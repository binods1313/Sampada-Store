// components/stories/FilterBar.tsx
import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import styles from '@/styles/Stories.module.css';

interface FilterBarProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
    onSearch: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    categories,
    activeCategory,
    onSelectCategory,
    onSearch
}) => {
    return (
        <div className={styles.filterBar}>
            <div className={styles.filterContainer}>
                <div className={styles.categories}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                            onClick={() => onSelectCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className={styles.searchWrapper}>
                    <AiOutlineSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search stories..."
                        className={styles.searchInput}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
