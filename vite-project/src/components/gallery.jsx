import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Gallery = () => {
    const galleryRef = useRef(null);

    useEffect(() => {
        const q = gsap.utils.selector(galleryRef);
        
        // Initial state set explicitly
        gsap.set(q(".animate-on-scroll, .image-wrapper, .gallery"), {
            opacity: 0,
            y: 20
        });
        
        // Staggered animation to visible state
        const anim = gsap.to(q(".animate-on-scroll, .image-wrapper, .gallery"), {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.5 // Small delay for better visual onset
        });

        return () => {
            anim.kill();
        };
    }, []);

    return (
        <div ref={galleryRef}>
            <h1 className="news animate-on-scroll"><i>TOP-NEWS</i></h1>
            <section className="gallery" aria-label="Bildübersicht">
                <a href="news.html" className="gallery-link">
                    <figure>
                        <div className="image-wrapper">
                            <img src="/pictures/duetschermeister59.jpg" className="bilder" alt="Bild 1" />
                            <img src="/pictures/dfb-pokal-2018.jpg" className="hover-image" alt="Hover Bild 1" />
                        </div>
                        <br />
                        <figcaption className="caption">
                            <span className="rotes-rechteck" aria-hidden="true"></span>
                            <span className="bilder-überschrift">08.03.2026 / EINTRACHT</span>
                        </figcaption>
                        <h1 className="bilder-überschrift-groß">127 Jahre Eintracht Frankfurt</h1>
                        <div className="beschreibung-container">
                            <h1 className="beschreibung animate-on-scroll">Von der Gründung bis zu ersten Deutschen Meisterschaft vergingen 60
                                Jahre. Es folgen zahlreiche Triumphe, aber auch bittere Stunden. Die Jahrzehnte im
                                Schnelldurchlauf.</h1>
                        </div>
                        <div className="grauer-strich"></div>
                    </figure>
                </a>
                <a href="beitrag2.html" className="gallery-link">
                    <figure>
                        <div className="image-wrapper">
                            <img src="/pictures/NWK-Choreo.jpg" className="bilder" alt="Bild 2" />
                            <img src="/pictures/waldstadion-nachts.jpg" className="hover-image" alt="Hover Bild 2" />
                        </div>
                        <br />
                        <figcaption className="caption">
                            <span className="rotes-rechteck" aria-hidden="true"></span>
                            <span className="bilder-überschrift">05.03.2026 / BUNDESLIGA</span>
                        </figcaption>
                        <h1 className="bilder-überschrift-groß">Abendspiele im Deutsche Bank Park</h1>
                        <div className="beschreibung-container">
                            <h1 className="beschreibung animate-on-scroll">Die Spieltage 28 bis 30 sind zeitgenau terminiert: Köln gastiert
                                sonntags, 17.30 Uhr, in Frankfurt. Leipzig kommt samstags um 18.30 Uhr. Die Ansetzungen im
                                Überblick.</h1>
                        </div>
                        <div className="grauer-strich"></div>
                    </figure>
                </a>
                <a href="beitrag3.html" className="gallery-link">
                    <figure>
                        <div className="image-wrapper">
                            <img src="/pictures/sge-pauli-hinspiel2526.jpg" className="bilder" alt="Bild 3" />
                            <img src="/pictures/pauli-sge-jubel.jpg" className="hover-image" alt="Hover Bild 3" />
                        </div>
                        <br />
                        <figcaption className="caption">
                            <span className="rotes-rechteck" aria-hidden="true"></span>
                            <span className="bilder-überschrift">04.03.2026 / BUNDESLIGA</span>
                        </figcaption>
                        <h1 className="bilder-überschrift-groß">Vorschau: Gastspiel am Millerntor</h1>
                        <div className="beschreibung-container">
                            <h1 className="beschreibung animate-on-scroll">Am 25. Spieltag trifft die Eintracht auswärts auf den FC St. Pauli. Die
                                Kiezkicker kommen mit Schwung aus einem erfolgreichen Monat Februar.</h1>
                        </div>
                        <div className="grauer-strich"></div>

                    </figure>
                </a>
                <a href="beitrag4.html" className="gallery-link">
                    <figure>
                        <div className="image-wrapper">
                            <img src="/pictures/sgefreiburgjubel.jpg" className="bilder" alt="Bild 4" />
                            <img src="/pictures/chaibi-jubel-sge-freiburg.jpg" className="hover-image" alt="Hover Bild 4" />
                        </div>
                        <br />
                        <figcaption className="caption">
                            <span className="rotes-rechteck" aria-hidden="true"></span>
                            <span className="bilder-überschrift">01.03.2026 / BUNDESLIGA</span>
                        </figcaption>
                        <h1 className="bilder-überschrift-groß">Chaibi und Bahoya treffen zum Heimsieg</h1>
                        <div className="beschreibung-container">
                            <h1 className="beschreibung animate-on-scroll">Die Eintracht besiegt den SC Freiburg mit 2:0 (0:0). Chaibi netzt 44
                                Sekunden nach seiner Einwechslung (64.), Bahoya erhöht (81.).</h1>
                        </div>
                        <div className="grauer-strich"></div>
                    </figure>
                </a>
            </section>
        </div>
    );
};

export default Gallery;