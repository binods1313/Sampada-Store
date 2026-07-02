import React, { useState, useEffect } from 'react';

function ColorFilter({ onColorSelect }) {
    const [availableColors, setAvailableColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        fetchAvailableColors();
    }, []);

    const fetchAvailableColors = async () => {
        try {
            const response = await fetch('/api/products/colors');
            const data = await response.json();
            setAvailableColors(data.colors || []);
        } catch (e) {
            console.error("Failed to fetch colors", e);
        }
    };

    const handleColorClick = (color) => {
        if (selectedColor?.hex === color.hex) {
            setSelectedColor(null);
            onColorSelect(null);
        } else {
            setSelectedColor(color);
            onColorSelect(color);
        }
    };

    return (
        <div className="color-filter-component" style={{ margin: '20px 0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px' }}>Filter by Color</h3>
            <div className="color-swatches" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableColors.map(color => (
                    <div
                        key={color.hex}
                        onClick={() => handleColorClick(color)}
                        title={color.name}
                        style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: color.hex,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: selectedColor?.hex === color.hex ? '2px solid #000' : '1px solid #ddd',
                            boxShadow: selectedColor?.hex === color.hex ? '0 0 0 2px white inset' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {selectedColor?.hex === color.hex && <span style={{ color: getContrastYIQ(color.hex), fontSize: '12px' }}>✓</span>}
                    </div>
                ))}
            </div>
            {selectedColor && (
                <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
                    Selected: <strong>{selectedColor.name || selectedColor.hex}</strong>
                    <button
                        onClick={() => handleColorClick(selectedColor)}
                        style={{ marginLeft: '10px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#999' }}
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}

function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export default ColorFilter;
