import { useState, useEffect, useRef, useMemo } from 'react';
import gsap from "gsap";

const Spielplan = () => {
    const [alleSpiele, setAlleSpiele] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [itemsVisible, setItemsVisible] = useState(6);
    const [cardWidth, setCardWidth] = useState(0);

    const API_URL = "https://api.openligadb.de/getmatchdata/bl1/2025";
    const GAP = 10;

    const wrapperRef = useRef(null);
    const scheduleRef = useRef(null);

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
                const eintrachtSpiele = data
                    .filter(match =>
                        (match.team1.teamName && match.team1.teamName.includes("Eintracht")) ||
                        (match.team2.teamName && match.team2.teamName.includes("Eintracht"))
                    )
                    .sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));

                setAlleSpiele(eintrachtSpiele);

                // Finde den Index des letzten abgeschlossenen Spiels
                let lastFinishedIndex = -1;
                for (let i = eintrachtSpiele.length - 1; i >= 0; i--) {
                    if (eintrachtSpiele[i].matchResults && eintrachtSpiele[i].matchResults.length > 0) {
                        lastFinishedIndex = i;
                        break;
                    }
                }

                // Starte so, dass das vorletzte gespielte Spiel ganz links ist (falls vorhanden)
                // Dadurch sind die letzten 2 gespielten Spiele sichtbar
                if (lastFinishedIndex !== -1) {
                    const startPage = Math.max(0, lastFinishedIndex - 1);
                    setCurrentPage(startPage);
                }

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        ladeSpiele();
    }, []);

    useEffect(() => {
        const updateLayout = () => {
            const width = wrapperRef.current?.clientWidth ?? window.innerWidth;
            const visible = width < 480 ? 1 : width < 768 ? 2 : width < 900 ? 3 : width < 1200 ? 4 : 6;

            setItemsVisible(visible);

            const calculatedCardWidth = (width - GAP * (visible - 1)) / visible;
            setCardWidth(Math.max(120, calculatedCardWidth));
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [alleSpiele.length]);

    const totalMatches = alleSpiele.length;
    const maxIndex = Math.max(0, totalMatches - itemsVisible);
    const offsetPx = currentPage * (cardWidth + GAP);

    useEffect(() => {
        if (currentPage > maxIndex) {
            setCurrentPage(maxIndex);
        }
    }, [maxIndex, currentPage]);

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

    useEffect(() => {
        if (loading || error || totalMatches === 0) return;

        const q = gsap.utils.selector(scheduleRef);

        gsap.set(q(".animate-on-scroll"), {
            opacity: 0,
            y: 20
        });

        const anim = gsap.to(q(".animate-on-scroll"), {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.2,
            ease: "power2.out",
            delay: 0.5
        });

        return () => {
            anim.kill();
        };
    }, [loading, error, totalMatches]);

    if (loading) return <div style={{ color: 'white', padding: '20px' }}>Lade Spielplan...</div>;
    if (error) return <div style={{ color: 'white', padding: '20px' }}>Fehler: {error}</div>;
    if (totalMatches === 0) return <div style={{ color: 'white', padding: '20px' }}>Keine Spiele für Eintracht in dieser Saison gefunden.</div>;

    return (
        <div ref={scheduleRef} style={{ maxWidth: '1800px', margin: '30px auto', padding: '0 12px' }}>
            <h1 className="news animate-on-scroll" style={{ marginTop: '70px', marginBottom: '10px' }}><i>SPIELPLAN</i></h1>

            <div ref={wrapperRef} className="spielplan-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
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
                        transform: `translateX(-${offsetPx}px)`,
                        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: 'flex',
                        flexWrap: 'nowrap',
                        gap: `${GAP}px`,
                        margin: '0',
                        padding: '0',
                        flexShrink: 0
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
                            <a
                                key={match.matchID}
                                className={`spielplan-spiel ${status}`}
                                style={{
                                    flex: `0 0 ${cardWidth}px`,
                                    width: `${cardWidth}px`,
                                    padding: '10px',
                                    boxSizing: 'border-box'
                                }}
                                href={`/${heim}-${gast}.html`}
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
                            </a>
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