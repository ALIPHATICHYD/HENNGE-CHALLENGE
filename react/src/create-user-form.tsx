import { type CSSProperties, type Dispatch, type SetStateAction, useState } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

export default function CreateUserForm({}: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const validatePassword = (pwd: string) => {
    const errors: string[] = [];
    if (pwd.length < 10) errors.push("Password must be at least 10 characters long");
    if (pwd.length > 24) errors.push("Password must be at most 24 characters long");
    if (/\s/.test(pwd)) errors.push("Password cannot contain spaces");
    if (!/[0-9]/.test(pwd)) errors.push("Password must contain at least one number");
    if (!/[A-Z]/.test(pwd)) errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("Password must contain at least one lowercase letter");
    return errors;
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    setValidationErrors(validatePassword(pwd));
    setApiError(null); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const passwordErrors = validatePassword(password);
    setValidationErrors(passwordErrors);
    if (!username || passwordErrors.length > 0) return;

    try {
      const response = await fetch('https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR_TOKEN_HERE', // replace with your actual token
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setUserWasCreated(true);
      } else if (response.status === 400) {
        setApiError("Sorry, the entered password is not allowed, please try a different one.");
      } else if (response.status === 401 || response.status === 403) {
        setApiError("Not authenticated to access this resource.");
      } else if (response.status === 500) {
        setApiError("Something went wrong, please try again.");
      } else {
        setApiError("Something went wrong, please try again.");
      }
    } catch (err) {
      setApiError("Something went wrong, please try again.");
    }
  };
  
  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        <label style={formLabel} htmlFor="username">Username</label>
        <input
          id="username"
          aria-label="Username"
          style={formInput}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setApiError(null);
          }}
        />

        <label style={formLabel} htmlFor="password">Password</label>
        <input
          id="password"
          aria-label="Password"
          aria-invalid={validationError.length > 0}
          style={formInput}
          type="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />

        {/* Password validation feedback */}
        {validationError.length > 0 && (
          <ul style={{ marginTop: '8px', color: 'red', paddingLeft: '16px' }}>
            {validationError.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        {/* API error feedback */}
        {apiError && <div style={{ color: 'red', marginTop: '8px' }}>{apiError}</div>}

        <button style={formButton} type="submit">Create User</button>
      </form>
    </div>
  );
}

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};


function setUserWasCreated(arg0: boolean) {
  throw new Error('Function not implemented.');
}

