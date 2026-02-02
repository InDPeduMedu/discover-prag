import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Discover Prague';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}
                >
                    {/* Yellow Triangle / Pyramid Logo Representation */}
                    <div
                        style={{
                            width: '0',
                            height: '0',
                            borderLeft: '50px solid transparent',
                            borderRight: '50px solid transparent',
                            borderBottom: '100px solid #EAB308', // yellow-500
                            marginRight: '30px',
                        }}
                    />
                </div>
                <div
                    style={{
                        fontSize: 80,
                        fontWeight: 'bold',
                        color: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        letterSpacing: '-0.05em',
                    }}
                >
                    <span style={{ color: '#EAB308' }}>Discover</span>
                    <span>Prague</span>
                </div>
                <div
                    style={{
                        fontSize: 30,
                        color: '#666',
                        marginTop: '20px',
                    }}
                >
                    Your AI Travel Companion
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
