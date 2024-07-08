import { Link } from 'react-router-dom';

const Main = () => {

    return (
        <div>
            <h2>Main Page</h2>
            <p>Login successful! Welcome to the main page.</p>
            <p><Link to="/logout">Logout</Link></p>
        </div>
    );
};

export default Main;