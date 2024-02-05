import { AllowedRoute } from "../../app/App";

export const Navigation = ({ onRouteChange, isSignedIn }: {onRouteChange: (route: AllowedRoute) => void, isSignedIn: boolean}) => {
    if (isSignedIn) {
        return (
            <nav className="flex justify-end gap-4 m-5">
                <button onClick={ () => onRouteChange('signedout') } className='btn-plain-text'>Sign Out</button>
            </nav>
        );
    } else {
        return (
            <nav className="flex justify-end gap-4 m-5">
                <button onClick={ () => onRouteChange('signin') } className='btn-plain-text'>Sign In</button>
                <button onClick={ () => onRouteChange('register') } className='btn-plain-text'>Register</button>
            </nav>
        )
    }
}

export default Navigation;