"use client";
import {useShopLocale} from "./LocaleProvider";
import {languageLabels,LANGUAGES,type WebsiteLanguage} from "../lib/i18n/translation";

const notices:Record<Exclude<WebsiteLanguage,"en">,{title:string;body:string;confirm:string;label:string;region:string;browser:string}>={
 es:{title:"¡Bienvenido a Reborna!",body:"Hemos seleccionado el español para ti. Puedes elegir otro idioma cuando quieras.",confirm:"Continuar en español",label:"Cambiar idioma",region:"Según tu región",browser:"Según el idioma de tu navegador"},
 it:{title:"Benvenuto su Reborna!",body:"Abbiamo selezionato l'italiano per te. Puoi scegliere un'altra lingua in qualsiasi momento.",confirm:"Continua in italiano",label:"Cambia lingua",region:"In base alla tua regione",browser:"In base alla lingua del browser"},
 de:{title:"Willkommen bei Reborna!",body:"Wir haben Deutsch für dich ausgewählt. Du kannst die Sprache jederzeit ändern.",confirm:"Auf Deutsch fortfahren",label:"Sprache ändern",region:"Aufgrund deiner Region",browser:"Aufgrund deiner Browsersprache"},
 ru:{title:"Добро пожаловать в Reborna!",body:"Мы выбрали для вас русский язык. Вы можете изменить язык в любой момент.",confirm:"Продолжить на русском",label:"Изменить язык",region:"По вашему региону",browser:"По языку браузера"}
};
export default function LanguageWelcome(){
 const {language,setLanguage,welcomeLanguage,welcomeReason,dismissLanguageWelcome}=useShopLocale();
 if(!welcomeLanguage||welcomeLanguage==="en")return null;
 const copy=notices[welcomeLanguage];
 return <section className="rbrn-language-welcome" role="status" aria-label={copy.title}>
  <div className="rbrn-language-welcome-mark" aria-hidden="true">✳</div>
  <div className="rbrn-language-welcome-body">
   <span className="rbrn-language-welcome-eyebrow">{welcomeReason==="region"?copy.region:copy.browser}</span>
   <h2>{copy.title}</h2>
   <p>{copy.body}</p>
   <div className="rbrn-language-welcome-actions">
    <button type="button" className="rbrn-language-welcome-confirm" onClick={dismissLanguageWelcome}>{copy.confirm}</button>
    <label><span>{copy.label}</span>
     <select aria-label={copy.label} value={language} onChange={e=>setLanguage(e.target.value as WebsiteLanguage)}>
      {LANGUAGES.map(code=><option key={code} value={code}>{languageLabels[code]}</option>)}
     </select>
    </label>
   </div>
  </div>
 </section>;
}
