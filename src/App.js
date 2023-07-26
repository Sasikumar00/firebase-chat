import './App.css';
import React from 'react';
// import { props } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import {Helmet} from 'react-helmet';

//HOOKS
import { useAuthState } from 'react-firebase-hooks/auth'; // to check if user is logged in
import { useCollectionData } from 'react-firebase-hooks/firestore'; // to get data from firestore

firebase.initializeApp({
  // Your web app's Firebase configuration
  apiKey: "AIzaSyAs_CeoEWc064q17h5AbfVhXC6hE2D4yfk",
  authDomain: "devchat-b6da3.firebaseapp.com",
  projectId: "devchat-b6da3",
  storageBucket: "devchat-b6da3.appspot.com",
  messagingSenderId: "920577402347",
  appId: "1:920577402347:web:b223ee950e0cc506ae65ae",
  measurementId: "G-RF3ENST1PC"
});

//SKDs as global variables
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(()=>{
    setTimeout(() => {
      setLoading(false);
    },1000);
  }, []);
  return (
    <div className="App">
      <Helmet>
        <script src="/hamMenu.js"></script>
      </Helmet>
      <header className="App-header">
        <div className='ham-menu'>
          <ul>
            <li><a href='#'>About</a></li>
            <li><a href='#'>Privacy & Policy</a></li>
            <li><SignOut /></li>
          </ul>
        </div>
        <div className='nav-left'>
          <img src="/devchat-logo.png" alt="logo"/>
          <h1>Dev<span>Chat</span></h1>
        </div>
        <div className='ham'>
          <img src='/hamburger.svg' alt='hamburger'/>
        </div>
        <div className='nav-right'>
          {/* Create links to different pages */}
          <a href='#'>About</a>
          <a href='#'>Privacy & Policy</a>
          <SignOut />
        </div>
      </header>
        <section>
          {loading ? <Loading /> : null}
          {user? <ChatRoom /> : <SignIn />}
        </section>
    </div>
  );
}

function Loading(){
  return (
    <div className='loading'>
      <h1>Loading...</h1>
    </div>
  )
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <div className='signIn-btn' >
      <button onClick={signInWithGoogle}>Sign in with google<img src='/google.png' alt='google'/></button>
    </div>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} className='sign-out'>Log Out</button>
  )
}

function ChatRoom(){
  const dummy = React.useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25); //limit to 25 messages

  const [messages] = useCollectionData(query, {idField: 'id'}); //hook to listen to data with a query
  // console.log(error);

  const [formValue, setFormValue] = React.useState('');
  const moveDummy = ()=>{
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }
  const sendMessage = async(e) => {
    e.preventDefault();
    setFormValue('');
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
}
  React.useEffect(()=>{
    moveDummy();
  }, [messages])
  return(
    <div className='chats'>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>

      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="user"/>
      <p>{text}</p>
    </div>
  )
}

export default App;
