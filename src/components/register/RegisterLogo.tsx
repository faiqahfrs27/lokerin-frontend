function RegisterLogo() {
  return (
    <a className="nav-brand" href="/" style={{ textDecoration: "none" }}>
      <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="2" y="2" width="60" height="60" rx="16" fill="#F97316" />
        <path
          d="M22 16 L22 44 L42 44"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="44" cy="20" r="5" fill="white" />
      </svg>
      lokerin
    </a>
  );
}

export default RegisterLogo;