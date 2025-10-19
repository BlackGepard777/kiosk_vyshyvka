import './HelloPage.css' 
import { Link } from 'react-router-dom';




function HelloPage() {
    return (
        <main>
            <div className="container">
                <h1>Клембівська фабрика Художніх виробів «ЖІНОЧА ПРАЦЯ»</h1>    
                <p className="subtitle" data-i18n="welcome">Ласкаво просимо до віртуального музею українського орнаменту.</p>
                <Link to= "/categories">
                    <button className="big-btn" id="start-btn" data-i18n="start">Розпочати подорож</button>
                </Link>
            </div>
        </main>
    );
}

export default HelloPage;