import { AiFillSketchCircle } from "react-icons/ai";

export default function CardSwapText() {

    return (
        <div className="card-swap-text">
            <h1>Waarom <span className="logo-font">QYVO?</span></h1>
            <div className="why-us-text">
            <div><AiFillSketchCircle /> <h1 className="why-us-text-title">Iedereen een website!</h1></div>
            <p className="why-us-text-description">Ons doel is om elk bedrijf – groot of klein – te voorzien van een professionele website die vertrouwen uitstraalt en resultaat boekt.</p>
            </div>
            <div className="why-us-text">
            <div><AiFillSketchCircle /> <h1 className="why-us-text-title">Persoonlijk & betrokken</h1></div>
            <p className="why-us-text-description">U heeft direct contact met uw webbouwer, ook na oplevering. We blijven bereikbaar voor vragen, updates of ondersteuning.</p>
            </div>
            <div className="why-us-text">
            <div><AiFillSketchCircle /> <h1 className="why-us-text-title">Duidelijk & betrouwbaar</h1></div>
            <p className="why-us-text-description">Geen vage beloften of verrassingen. Gewoon heldere communicatie, duidelijke afspraken en goede service.</p>
            </div>
        </div>
    );
  } 