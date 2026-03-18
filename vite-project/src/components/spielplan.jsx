import { useState, useEffect } from 'react';

const Spielplan = () => {
    const [alleSpiele, setAlleSpiele] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = "https://api.openligadb.de/getmatchdata/bl1/2025";

    const teamWappen = {
        "Bayern München": "bayern-wappen.png",
        "Borussia Dortmund": "dortmund-wappen.png",
        "VfL Wolfsburg": "wolfsburg-wappen.png",
        "Leverkusen": "leverkusen-wappen.png",
        "Hamburger SV": "hamburg-wappen.png",
        "SV Werder Bremen": "werder-wappen.png",
        "1. FC Köln": "köln-wappen.png",
        "VfL Borussia Mönchengladbach": "mönchengladbach-wappen.png",
        "SC Freiburg": "freiburg-wappen.png",
        "TSG Hoffenheim": "hoffenheim-wappen.png",
        "Eintracht Frankfurt": "eintracht-wappen.png",
        "FC Augsburg": "augsburg-wappen.png",
        "VfB Stuttgart": "stuttgart-wappen.png",
        "Mainz 05": "mainz-wappen.png",
        "FC Union Berlin": "union-wappen.png",
        "1. FC Heidenheim": "heidenheim-wappen.png",
        "FC St. Pauli": "pauli-wappen.png",
        "RB Leipzig": "leipzig-wappen.png"
    };

    const teamAbbreviations = {
        "Bayern München": "FCB",
        "Borussia Dortmund": "BVB",
        "VfL Wolfsburg": "WOB",
        "Leverkusen": "B04",
        "Hamburger SV": "HSV",
        "SV Werder Bremen": "SVW",
        "1. FC Köln": "KOE",
        "VfL Borussia Mönchengladbach": "BMG",
        "SC Freiburg": "SCF",
        "TSG Hoffenheim": "TSG",
        "Eintracht Frankfurt": "SGE",
        "FC Augsburg": "FCA",
        "VfB Stuttgart": "VFB",
        "Mainz 05": "M05",
        "FC Union Berlin": "FCU",
        "1. FC Heidenheim": "FCH",
        "FC St. Pauli": "FCP",
        "RB Leipzig": "RBL"
    };

    const getTeamWappen = (teamName) => {
        if (teamWappen[teamName]) return teamWappen[teamName];
        for (const [fullName, wappen] of Object.entries(teamWappen)) {
            if (teamName.includes(fullName) || fullName.includes(teamName)) return wappen;
        }
        return "eintracht-wappen.png";
    };

    const getTeamAbbreviation = (teamName) => {
        if (teamAbbreviations[teamName]) return teamAbbreviations[teamName];
        for (const [fullName, abbr] of Object.entries(teamAbbreviations)) {
            if (teamName.includes(fullName) || fullName.includes(teamName)) return abbr;
        }
        return teamName.substring(0, 3).toUpperCase();
    };

    useEffect(() => {
        const ladeSpiele = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("API-Fehler: " + response.status);

                const data = await response.json();
                const eintrachtSpiele = data.filter(match =>
                    (match.team1.teamName && match.team1.teamName.includes("Eintracht")) ||
                    (match.team2.teamName && match.team2.teamName.includes("Eintracht"))
                );
                eintrachtSpiele.sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));

                setAlleSpiele(eintrachtSpiele);

                const jetzt = new Date();
                let nächstesSpieleIndex = eintrachtSpiele.findIndex(m =>
                    new Date(m.matchDateTime) > jetzt
                );
                if (nächstesSpieleIndex === -1) nächstesSpieleIndex = eintrachtSpiele.length;
                
                setCurrentPage(Math.max(0, 0));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        ladeSpiele();
    }, []);

    const [itemsVisible, setItemsVisible] = useState(6);
    const maxIndex = Math.max(0, 9);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 480) setItemsVisible(1);
            else if (window.innerWidth < 768) setItemsVisible(2);
            else if (window.innerWidth < 900) setItemsVisible(3);
            else if (window.innerWidth < 1200) setItemsVisible(4);
            else setItemsVisible(6);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextPage = () => {
        if (currentPage < maxIndex) {
            setCurrentPage(prev => Math.min(maxIndex, prev + 1));
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => Math.max(0, prev - 1));
        }
    };

    const offsetPercent = (currentPage * 100) / itemsVisible;

    if (loading) return <div style={{ color: 'white', padding: '20px' }}>Lade Spielplan...</div>;
    if (error) return <div style={{ color: 'white', padding: '20px' }}>Fehler: {error}</div>;

    const totalMatches = alleSpiele.length;
    if (totalMatches === 0) return <div style={{ color: 'white', padding: '20px' }}>Keine Spiele für Eintracht in dieser Saison gefunden.</div>;

    const containerWidthPercent = (totalMatches / itemsVisible) * 100;
    const itemWidthPercent = 100 / totalMatches;

    return (
        <div style={{ maxWidth: '1800px', margin: '30px auto', padding: '0 12px' }}>
            <h1 className="news" style={{ marginTop: '70px', marginBottom: '10px' }}><i>SPIELPLAN</i></h1>
            <div className="spielplan-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
                <button 
                    className="spielplan-btn spielplan-btn-left" 
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                >
                    &lt;
                </button>
                
                <div 
                    id="spielplan-container"
                    style={{ 
                        transform: `translateX(-${offsetPercent}%)`,
                        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: 'flex',
                        flexWrap: 'nowrap',
                        width: `${containerWidthPercent}%`,
                        margin: '0',
                        padding: '0'
                    }}
                >
                    {alleSpiele.map((match) => {
                        const heim = getTeamAbbreviation(match.team1.teamName);
                        const gast = getTeamAbbreviation(match.team2.teamName);
                        const heimWappen = getTeamWappen(match.team1.teamName);
                        const gastWappen = getTeamWappen(match.team2.teamName);

                        let score = "-:-";
                        let status = "kommend";

                        if (match.matchResults.length > 0) {
                            const result = match.matchResults[match.matchResults.length - 1];
                            score = `${result.pointsTeam1}:${result.pointsTeam2}`;
                            status = "abgeschlossen";
                        }

                        const datum = new Date(match.matchDateTime);
                        const zeit = datum.toLocaleDateString("de-DE") + ", " +
                            datum.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

                        return (
                            <div 
                                key={match.matchID} 
                                className={`spielplan-spiel ${status}`}
                                style={{ 
                                    flex: `0 0 5%`,
                                    padding: '10px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div className="ergebnis" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src={`/pictures/${heimWappen}`} alt="" className="wappen-spielplan" style={{ width: '25px', height: '25px' }} />
                                    <span className="vereine-spielplan" style={{ minWidth: '35px' }}>{heim}</span>
                                    <span className="ergebnis-score" style={{ margin: '0 5px' }}>{score}</span>
                                    <span className="vereine-spielplan" style={{ minWidth: '35px' }}>{gast}</span>
                                    <img src={`/pictures/${gastWappen}`} alt="" className="wappen-spielplan" style={{ width: '25px', height: '25px' }} />
                                </div>
                                <span className="spielzeit-spielplan" style={{ display: 'block', textAlign: 'center', marginTop: '5px' }}>BL / {zeit}</span>
                                <div className="grauer-strich" style={{ marginTop: '10px' }}></div>
                            </div>
                        );
                    })}
                </div>

                <button 
                    className="spielplan-btn spielplan-btn-right" 
                    onClick={nextPage}
                    disabled={currentPage >= maxIndex}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Spielplan;