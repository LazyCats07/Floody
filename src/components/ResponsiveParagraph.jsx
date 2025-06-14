import React from 'react';

export default function ResponsiveParagraph({ children }) {
    return (
        <p style={{ fontSize: '1rem', lineHeight: 1.5 }}>
            {children}
        </p>
    );
}