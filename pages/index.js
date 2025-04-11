// Static index page for Vercel deployment
export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
        Derra - World of Business
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#555', textAlign: 'center', maxWidth: '600px' }}>
        The API for this application is running. Please access the main application URL.
      </p>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#333' }}>
          API Status
        </h2>
        <a 
          href="/api/status" 
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f0f7ff',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
        >
          Check API Status
        </a>
        <a 
          href="/api/categories" 
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f0f7ff',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
        >
          View Categories
        </a>
        <a 
          href="/api/businesses/featured" 
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f0f7ff',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
        >
          View Featured Businesses
        </a>
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: '#777' }}>
          Demo credentials: <strong>demo_user</strong> / <strong>password123</strong>
        </p>
      </div>
    </div>
  );
}