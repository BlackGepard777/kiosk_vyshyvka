import './CategoriesPage.css' 

function CategoriesPage() {
    return (
        <main>
            <div className="container">    
                <p className="subtitle" data-i18n="welcome">Ласкаво просимо до віртуального музею українського орнаменту.</p>
                <button className="big-btn" id="start-btn" data-i18n="start">Розпочати подорож</button>
            </div>
        </main>
    );
}

export default CategoriesPage;