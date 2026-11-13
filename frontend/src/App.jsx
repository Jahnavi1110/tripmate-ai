import { useEffect, useMemo, useState } from "react";
import { Plane, TrainFront, Search, Ticket, Headphones, MapPin, CalendarDays, ArrowRight, Clock3, IndianRupee, RefreshCw, XCircle, CheckCircle2, Activity, Menu } from "lucide-react";
import { api } from "./api";

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

function App() {
  const [tab, setTab] = useState("trains");
  const [page, setPage] = useState("search");
  const [form, setForm] = useState({ from: "Bengaluru", to: "Delhi", date: tomorrow() });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState(null);
  const [passenger, setPassenger] = useState({ name: "", age: "22", email: "", phone: "" });
  const [myEmail, setMyEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    api.health().then(() => setApiStatus("online")).catch(() => setApiStatus("offline"));
  }, []);

  const title = tab === "trains" ? "Find your next train" : "Find your next flight";

  async function searchTravel(event) {
    event?.preventDefault();
    setError(""); setNotice(""); setSelected(null); setLoading(true);
    try {
      const response = await api.search(tab, form);
      setResults(response.data || []);
      if (!response.data?.length) setNotice("No demo options found for this route and date. Try Bengaluru → Delhi or Bengaluru → Chennai.");
    } catch (e) { setError(e.message); setResults([]); }
    finally { setLoading(false); }
  }

  async function submitBooking(event) {
    event.preventDefault();
    setError(""); setNotice(""); setLoading(true);
    try {
      const response = await api.createBooking({
        optionId: selected._id,
        passenger: { name: passenger.name, age: Number(passenger.age) },
        email: passenger.email,
        phone: passenger.phone
      });
      setNotice(`${response.message} Your reference is ${response.data.bookingRef}.`);
      setSelected(null);
      setPassenger({ name: "", age: "22", email: passenger.email, phone: "" });
      await loadBookings(passenger.email);
      setPage("bookings");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function loadBookings(email = myEmail) {
    if (!email.trim()) { setError("Enter the email used for your booking."); return; }
    setError(""); setNotice(""); setLoading(true);
    try {
      const response = await api.getBookings(email);
      setBookings(response.data || []);
      setMyEmail(email);
      setPage("bookings");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function cancelBooking(ref) {
    if (!window.confirm(`Cancel demo booking ${ref}?`)) return;
    setError(""); setNotice("");
    try {
      const response = await api.cancelBooking(ref);
      setNotice(response.message);
      await loadBookings(myEmail);
    } catch (e) { setError(e.message); }
  }

  async function loadLogs() {
    setError("");
    try {
      const response = await api.logs();
      setLogs(response.data || []);
      setPage("logs");
    } catch (e) { setError(e.message); }
  }

  const activeLabel = useMemo(() => tab === "trains" ? "Train" : "Flight", [tab]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => { setPage("search"); setSelected(null); }}>
          <span className="brand-mark"><MapPin size={20}/></span>
          <span>tripmate<span className="brand-ai">.ai</span><small>YOUR JOURNEY, SIMPLIFIED</small></span>
        </a>
        <nav>
          <button className={page === "search" ? "nav-link active" : "nav-link"} onClick={() => { setPage("search"); setSelected(null); }}>Explore</button>
          <button className={page === "bookings" ? "nav-link active" : "nav-link"} onClick={() => setPage("bookings")}>My bookings</button>
          <button className={page === "logs" ? "nav-link active" : "nav-link"} onClick={loadLogs}>API activity</button>
        </nav>
        <div className="status"><span className={`status-dot ${apiStatus}`}></span> API {apiStatus}</div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">A SMARTER WAY TO GET THERE</span>
            <h1>Every journey<br/><em>starts somewhere.</em></h1>
            <p>Compare demo train and flight options, make a sample booking, and keep your trip details in one place.</p>
            <div className="hero-pills"><span><CheckCircle2 size={15}/> Simple booking</span><span><Activity size={15}/> API-powered</span><span><Headphones size={15}/> Voice-ready architecture</span></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun"></div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="plane-illustration"><Plane size={76} strokeWidth={1.2}/></div>
            <div className="route-tag tag-one"><span>✦</span> Explore more</div>
            <div className="route-tag tag-two"><MapPin size={14}/> Your next stop</div>
          </div>
        </section>

        <section className="booking-panel">
          <div className="booking-tabs">
            <button className={tab === "trains" ? "mode active" : "mode"} onClick={() => { setTab("trains"); setResults([]); setSelected(null); }}><TrainFront size={18}/> Trains</button>
            <button className={tab === "flights" ? "mode active" : "mode"} onClick={() => { setTab("flights"); setResults([]); setSelected(null); }}><Plane size={18}/> Flights</button>
          </div>
          <form className="search-form" onSubmit={searchTravel}>
            <label><span><MapPin size={15}/> FROM</span><input value={form.from} onChange={e => setForm({...form, from:e.target.value})} placeholder="Departure city" required/></label>
            <div className="swap"><ArrowRight size={18}/></div>
            <label><span><MapPin size={15}/> TO</span><input value={form.to} onChange={e => setForm({...form, to:e.target.value})} placeholder="Destination city" required/></label>
            <label><span><CalendarDays size={15}/> JOURNEY DATE</span><input type="date" min={tomorrow()} value={form.date} onChange={e => setForm({...form, date:e.target.value})} required/></label>
            <button className="primary search-button" disabled={loading}><Search size={18}/>{loading ? "Searching..." : "Search"}</button>
          </form>
          <div className="demo-note">Demo inventory only · No real tickets or payments</div>
        </section>

        {error && <div className="alert error"><XCircle size={18}/>{error}</div>}
        {notice && <div className="alert success"><CheckCircle2 size={18}/>{notice}</div>}

        {page === "search" && (
          <section className="content-section">
            {selected ? (
              <div className="checkout-card">
                <button className="back-link" onClick={() => setSelected(null)}>← Back to results</button>
                <div className="section-heading"><div><span className="eyebrow">PASSENGER DETAILS</span><h2>Almost there.</h2></div></div>
                <div className="selected-summary"><div className="option-icon">{selected.kind === "train" ? <TrainFront/> : <Plane/>}</div><div><strong>{selected.name} · {selected.code}</strong><p>{selected.from} → {selected.to} · {selected.date}</p></div><b>₹{selected.price.toLocaleString("en-IN")}</b></div>
                <form className="passenger-form" onSubmit={submitBooking}>
                  <label>Passenger name<input required minLength="2" value={passenger.name} onChange={e=>setPassenger({...passenger,name:e.target.value})} placeholder="Full name"/></label>
                  <label>Age<input required type="number" min="1" max="120" value={passenger.age} onChange={e=>setPassenger({...passenger,age:e.target.value})}/></label>
                  <label>Email<input required type="email" value={passenger.email} onChange={e=>setPassenger({...passenger,email:e.target.value})} placeholder="you@example.com"/></label>
                  <label>Phone (optional)<input value={passenger.phone} onChange={e=>setPassenger({...passenger,phone:e.target.value})} placeholder="Phone number"/></label>
                  <div className="mock-payment"><span>DEMO CHECKOUT</span><strong>₹{selected.price.toLocaleString("en-IN")}</strong><small>Mock payment only. No card details are collected and no money is charged.</small></div>
                  <button className="primary" disabled={loading}>{loading ? "Confirming..." : "Confirm demo booking"} <ArrowRight size={17}/></button>
                </form>
              </div>
            ) : (
              <>
                <div className="section-heading"><div><span className="eyebrow">DISCOVER YOUR OPTIONS</span><h2>{results.length ? `${results.length} ${activeLabel.toLowerCase()} options` : title}</h2></div>{results.length > 0 && <span className="result-count">Sorted by price ↑</span>}</div>
                {results.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">{tab === "trains" ? <TrainFront size={28}/> : <Plane size={28}/>}</div><h3>Your next trip is one search away</h3><p>Search the seeded demo routes above to see available options.</p><div className="suggestions"><button onClick={()=>{setForm({...form,from:"Bengaluru",to:"Delhi"});}}>Bengaluru → Delhi</button><button onClick={()=>{setForm({...form,from:"Bengaluru",to:"Chennai"});setTab("trains");}}>Bengaluru → Chennai</button><button onClick={()=>{setForm({...form,from:"Bengaluru",to:"Mumbai"});setTab("flights");}}>Bengaluru → Mumbai</button></div></div>
                ) : (
                  <div className="results-grid">{results.map(option => <article className="travel-card" key={option._id}>
                    <div className="card-top"><span className="operator">{option.kind === "train" ? <TrainFront size={16}/> : <Plane size={16}/>} {option.name}</span><span className="mock-badge">DEMO</span></div>
                    <div className="journey"><div><strong>{option.departure}</strong><small>{option.from}</small></div><div className="journey-line"><span></span><small>{option.duration}</small><span></span></div><div className="arrival"><strong>{option.arrival}</strong><small>{option.to}</small></div></div>
                    <div className="card-meta"><span>{option.code}</span><span>{option.classOrCabin}</span><span>{option.seatsAvailable} seats left</span></div>
                    <div className="card-bottom"><div><small>PRICE / PERSON</small><strong><IndianRupee size={17}/>{option.price.toLocaleString("en-IN")}</strong></div><button className="primary small" onClick={()=>setSelected(option)}>Select <ArrowRight size={15}/></button></div>
                  </article>)}</div>
                )}
              </>
            )}
          </section>
        )}

        {page === "bookings" && (
          <section className="content-section">
            <div className="section-heading"><div><span className="eyebrow">YOUR TRAVEL DETAILS</span><h2>My bookings</h2></div></div>
            <form className="lookup-form" onSubmit={e=>{e.preventDefault();loadBookings(myEmail);}}><input type="email" required placeholder="Enter the email used at booking" value={myEmail} onChange={e=>setMyEmail(e.target.value)}/><button className="primary">Find bookings <Search size={16}/></button></form>
            {bookings.length === 0 ? <div className="empty-state compact"><Ticket size={28}/><h3>No bookings loaded</h3><p>Enter your email above to look up your demo bookings.</p></div> : <div className="booking-list">{bookings.map(b=><article className="booking-row" key={b._id}><div className="booking-symbol">{b.kind === "train" ? <TrainFront/> : <Plane/>}</div><div className="booking-info"><strong>{b.travelOption?.name || "Travel option"}</strong><span>{b.travelOption?.from} → {b.travelOption?.to} · {b.bookingRef}</span><small>{b.passenger.name} · {b.email}</small></div><div className="booking-right"><span className={b.status === "CONFIRMED" ? "status-label confirmed" : "status-label cancelled"}>{b.status}</span><strong>₹{b.totalAmount.toLocaleString("en-IN")}</strong>{b.status === "CONFIRMED" && <button className="text-danger" onClick={()=>cancelBooking(b.bookingRef)}>Cancel demo booking</button>}</div></article>)}</div>}
          </section>
        )}

        {page === "logs" && (
          <section className="content-section">
            <div className="section-heading"><div><span className="eyebrow">DEVELOPER VIEW</span><h2>API activity</h2><p className="subheading">Recent requests received by the backend in this running session.</p></div><button className="outline-button" onClick={loadLogs}><RefreshCw size={15}/> Refresh</button></div>
            <div className="logs-table"><div className="log-head"><span>TIME</span><span>METHOD</span><span>ENDPOINT</span><span>STATUS</span><span>DURATION</span></div>{logs.length === 0 ? <div className="no-logs">No requests recorded yet. Search for a route first.</div> : logs.map((log,i)=><div className="log-row" key={i}><span>{new Date(log.time).toLocaleTimeString()}</span><b>{log.method}</b><code>{log.path}</code><span className={log.status < 400 ? "code-good" : "code-bad"}>{log.status}</span><span>{log.durationMs} ms</span></div>)}</div>
          </section>
        )}
      </main>
      <footer><div className="footer-brand">tripmate<span>.ai</span></div><p>Built as a voice-ready travel booking demo. Mock inventory · Mock checkout · No real tickets issued.</p><span className="footer-status"><span className={`status-dot ${apiStatus}`}></span> Backend {apiStatus}</span></footer>
    </div>
  );
}

export default App;
