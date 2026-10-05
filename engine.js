/* Delulu engine: local joke brain + easter eggs. No deps. Global: Delulu */
const Delulu = (() => {
  const R = (a) => a[Math.floor(Math.random() * a.length)];
  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
  const loading = ["Checking your last 47 assumptions...","Asking the group chat (they're asleep)...","Interrogating a single emoji...","Zooming in on the 'seen' timestamp...","Consulting a panel of raccoons...","Calling the grass department...","Measuring the vibes with a ruler...","Cross-referencing with absolutely nothing...","Scientists have been notified...","Rewatching the evidence in 0.5x speed...","Subpoenaing your Notes app...","Downloading more evidence (none found)...","Asking your ex for a second opinion (denied)...","Bro, please remain calm."];
  const topics = [
    { id:"read", re:/left on read|seen|read my|viewed|story|haven'?t (replied|texted|responded)|didn'?t (reply|respond|text)|no reply|online/, v:["You turned a 3-second interaction into a Netflix original.","Bro has connected 14 unrelated events.","Seen is not a verdict. It's a button."], r:["Viewing your story is not a legally binding declaration of love.","They saw it, got distracted by a pigeon, and became a different person. It happens.","'Seen' means their thumb touched glass. That's the whole lore."], a:["Text them something normal. Or don't. But stop refreshing.","Put the phone in another room. It is not a crystal ball."] },
    { id:"like", re:/\blike[sd]?\b|double.?tap|heart(ed)?|follow(ed|s)?\b|comment/, v:["A like is a muscle spasm with Wi-Fi.","Your evidence is currently being held together by vibes."], r:["A like is data. It is not a five-year plan.","They liked 40 photos that night. You were one. Sorry."], a:["Do not draft the wedding speech.","Like something back and move on. Calmly. With a straight face."] },
    { id:"sign", re:/sign|fate|meant to be|destiny|universe|11:11|angel number|coincidence|soulmate|synchron/, v:["That is not a sign. That is literally just a Tuesday.","The universe has bigger problems than your situationship."], r:["Seeing 11:11 means you looked at a clock twice. Congrats.","The universe is busy. It is not sending you coded messages through a Spotify shuffle."], a:["Ask the human, not the cosmos.","Cancel the astrologer. Call the friend."] },
    { id:"ex", re:/\bex\b|exes|my ex|got back|miss (him|her|them)|old (flame|crush)/, v:["The ex file is closed. Why is it open?","You're doing archaeology on a ruin."], r:["They're not 'checking in'. They're bored on a Wednesday.","There is a reason it ended. It was in the file you're ignoring."], a:["Mute. Don't block, don't stalk, just mute and walk.","Let the file stay closed."] },
    { id:"work", re:/boss|manager|work|interview|email|meeting|promotion|colleague|coworker|job|hr\b/, v:["The meeting could have been an email and so could this spiral.","Bro is analyzing 'Thanks!' like a hostage note."], r:["'Per my last email' is rude, not a secret code.","Your boss has 40 other fires. You are not the main character of their calendar."], a:["Ask one direct question. In writing. Then go outside.","Do your job. Drink water. The rest is vibes."] },
    { id:"friend", re:/friend|bestie|group chat|invited|plans|hang ?out|left out|ignoring me/, v:["Not everyone's plans are about you. Wild, we know.","The group chat is not a court of law."], r:["Nobody organized a secret meeting. They forgot. People are forgetful and tired.","If you weren't invited, it's usually logistics, not lore."], a:["Invite them to something. Make it a plan, not a theory.","Ask directly. Friends love an awkward honest question more than silent spiraling."] },
    { id:"ai", re:/chatgpt|\bai\b|claude|gemini|told me i/, v:["You asked a robot to settle this. The robot is also concerned."], r:["We are an AI-adjacent joke website. You're asking a joke website. Think about that."], a:["Phone a human. Preferably one with hands."] },
    { id:"night", re:/3 ?am|2 ?am|4 ?am|midnight|can'?t sleep|up all night|2:\d\d|3:\d\d|4:\d\d/, v:["Nothing you decide at 3AM is legally valid.","The 3AM brain is a lawyer with no license."], r:["At 3AM every ellipsis is a threat. At 10AM it's just punctuation.","Sleep deprivation is why this feels like a thriller."], a:["Water. Dark room. Phone face down. We'll hear the case in the morning."] }
  ];
  const tiers = [
    { max:14, face:"😌", tag:"Suspiciously sane", v:["Statistically normal. We're a little disappointed.","You're fine. Next.","Reality has been verified. Proceed."], r:["Your read is accurate. The evidence is real. Annoying."], a:["Trust yourself. It's weird, we know.","Act on it. Calmly."] },
    { max:39, face:"🙂", tag:"Mild delulu", v:["Slightly delusional. Like, a decaf latte of delusion.","Cute theory. Needs a source."], r:["Your theory is plausible. Also: so is a sandwich.","You're one data point away from a hypothesis."], a:["Ask one real question and enjoy the silence.","Drink water. Then reassess."] },
    { max:59, face:"🧑‍🍳", tag:"Cooking", v:["Bro is cooking. Nobody asked for this meal.","You have a plot. The plot has no evidence."], r:["You're building a skyscraper on a Post-it note.","That's a vibe, not a verdict."], a:["Take a lap. A real one. With legs.","Ask the person. Not the group chat."] },
    { max:77, face:"🫣", tag:"Overcooking", v:["Bro is overcooking. The smoke alarm has gone off.","This is a limited series now, and it's not renewed."], r:["You've cast three characters who never auditioned.","You've been doing detective work with zero crime."], a:["Phone down. Eyes up. Sky is free.","Delete the screenshot folder."] },
    { max:91, face:"🫠", tag:"Dangerous levels", v:["Delusion has entered dangerous levels. Please step back.","The council has convened. The council is worried."], r:["You have built a cinematic universe from a single punctuation mark.","This theory has a theme song now."], a:["Put. The phone. Down.","Go outside and look at a tree. Any tree."] },
    { max:100, face:"🚨", tag:"Scientists notified", v:["Scientists have been notified.","This is not a spiral. This is a documentary."], r:["There is no evidence. There is only lore.","You are not Sherlock. You are in a hallway with a corkboard and string."], a:["Please put the phone down.","Touch grass. Immediately. We're not joking. (We're joking. But still.)"] }
  ];
  const notes = ["Your brain has opened 14 unnecessary tabs.","The internal detective agency is fully staffed.","You cross-examined a vibe.","This thought has a director's cut.","The group chat in your head is typing...","One spreadsheet away from a documentary."];
  const worse = [["Bro now believes the pigeon outside is involved.","The pigeon is a plant. The pigeon has a LinkedIn."],["It's not just them. It's their entire family tree.","Your cousin's cousin 'liked' something in 2017. It's all connected."],["You've found a pattern. The pattern is you.","The pattern is a Wi-Fi signal. Stop."],["Delusion has gone interdimensional.","In a parallel universe they replied. In this one, you're reading a joke website."],["The brain has left the building. Please hold.","You've now been wrong in four dimensions."]];
  const rare = [
    { p:.001, id:"glitch", name:"Reality.exe crashed", d:NaN, o:NaN, face:"🧿", v:"ERROR: reality.exe has stopped working.", r:"You broke the machine. We've never seen this. 1-in-1000. Screenshot it.", a:"Go buy a lottery ticket. Then touch grass.", tag:"1/1000" },
    { p:.01, id:"right", name:"Plot twist: you're right", d:3, o:96, face:"🧠", v:"Plot twist: you're not delusional.", r:"We checked twice. You're correct. It's genuinely annoying.", a:"Act on it. Be normal. We're as shocked as you.", tag:"1/100" },
    { p:.03, id:"split", name:"Council is split", d:50, o:50, face:"⚖️", v:"The council voted 2-1. The third member was on his phone.", r:"One of them wants to marry the situation. One of them wants to leave. One is asleep.", a:"Settle it yourself. Cheap, legal, and rude to the council.", tag:"3%" }
  ];
  const eggs = [
    { id:"delulu", re:/delulu is the solulu/, d:100, o:100, face:"👑", v:"Honorary Delulu Citizen. Certificate in the mail.", r:"You know the secret phrase. The council salutes you.", a:"Wear the crown. Stay hydrated.", tag:"SECRET" },
    { id:"meta", re:/am i being delusional|am i delulu/, d:69, o:99, face:"🪞", v:"You asked a delusion website if you're delusional. Recursive. Cute.", r:"That is the first symptom, and also the last.", a:"Close the tab. Open a window. Real one.", tag:"SECRET" },
    { id:"grass", re:/touch grass/, d:42, o:30, face:"🌱", v:"You typed 'touch grass' into a website. Go do it.", r:"We see the irony. The grass sees it too.", a:"Outside. Now. We'll wait.", tag:"SECRET" },
    { id:"merc", re:/mercury retrograde|retrograde/, d:88, o:70, face:"🪐", v:"Mercury retrograde is a planet, not an excuse.", r:"A planet 90 million km away didn't text you late. Your crush did.", a:"Blame the planet today. Tomorrow, you.", tag:"SECRET" }
  ];
  const dex = { delulu:"Secret phrase", meta:"The meta question", grass:"Self-aware", merc:"Blame the planet", glitch:"Reality.exe crashed", right:"Plot twist", split:"Council is split", melt:"Meltdown", konami:"Konami", logo:"Brain abuse", night:"3AM brain", worse5:"Interdimensional", repeat:"Repeat offender", short:"Insufficient evidence" };
  const found = () => { try { return JSON.parse(localStorage.getItem("delulu-dex") || "[]"); } catch { return []; } };
  const unlock = (id) => { const f = found(); if (f.includes(id)) return false; f.push(id); try { localStorage.setItem("delulu-dex", JSON.stringify(f)); } catch {} return true; };
  const crisis = /kill myself|suicid|want to die|end it all|hurt myself|self.?harm|don'?t want to be alive/i;
  const tier = (s) => tiers.find((t) => s <= t.max) || tiers[5];
  const faceOf = (s) => tier(s).face;

  function score(text, cat) {
    const t = text.toLowerCase(); let d = 22 + R([0,3,6,9,12]), o = 25 + R([0,4,8,12]);
    const add = (re, a, b) => { if (re.test(t)) { d += a; o += b; } };
    add(/sign|fate|destiny|universe|meant|soulmate|marry|future/, 16, 10); add(/definitely|obviously|100%|for sure|literally|clearly/, 12, 6);
    add(/what if|maybe|does this mean|why/, 5, 14); add(/story|seen|viewed|liked|left on read|read my/, 9, 14);
    add(/blocked|unfollow|ghost|ignor|stalk|fake account|checking/, 12, 16); add(/minute|hour|pattern|timeline|2:\d\d|3 ?am|\d+ times/, 7, 12);
    add(/asked (them|him|her)|we talked|they said|told me|texted me back/, -14, -8); add(/just wondering|not overthinking/, 8, 10);
    d += Math.min((text.match(/\?/g) || []).length * 2, 8); o += Math.min(text.length / 40, 14);
    if (text === text.toUpperCase() && /[A-Z]{6}/.test(text)) { d += 10; o += 10; }
    d += { Crush:8, "Social Media":9, Friendship:2, Life:1, Random:3 }[cat] || 4;
    return [clamp(d), clamp(o)];
  }
  function build(o) { return Object.assign({ verdict:"", reality:"", advice:"", note:R(notes), rare:null, egg:null }, o); }

  function analyze(text, cat, ctx = {}) {
    if (crisis.test(text)) return { crisis: true };
    const hour = new Date().getHours(), t = text.toLowerCase();
    const egg = eggs.find((e) => e.re.test(t));
    if (egg) return build({ text, category:cat, delusion:egg.d, overthinking:egg.o, face:egg.face, verdict:egg.v, reality:egg.r, advice:egg.a, tag:egg.tag, egg:egg.id });
    if (text.trim().length < 6) return build({ text, category:cat, delusion:0, overthinking:0, face:"🦗", verdict:"Insufficient evidence. We can't roast a vibe with " + text.trim().length + " characters.", reality:"Give us a detail. A timestamp. An emoji. Anything.", advice:"Try again with the actual tea.", tag:"TOO SHORT", egg:"short" });
    const roll = Math.random(), rr = roll < rare[0].p ? rare[0] : roll < rare[1].p + rare[0].p ? rare[1] : roll < .08 ? rare[2] : null;
    if (rr) return build({ text, category:cat, delusion:rr.d, overthinking:rr.o, face:rr.face, verdict:rr.v, reality:rr.r, advice:rr.a, tag:rr.tag, rare:rr.name, egg:rr.id });
    let [d, o] = score(text, cat); const tp = topics.filter((x) => x.re.test(t)); const tr = tier(d); const pick = (k, tk) => (tp.length && Math.random() < .65 ? R(R(tp)[k]) : R(tr[tk]));
    const out = build({ text, category:cat, delusion:d, overthinking:o, face:tr.face, tag:tr.tag, verdict:pick("v", "v"), reality:pick("r", "r"), advice:pick("a", "a") });
    if (hour >= 2 && hour < 5) { out.night = "It's " + new Date().toLocaleTimeString([], { hour:"numeric", minute:"2-digit" }) + ". Nothing you conclude right now counts. Go to sleep."; out.egg = "night"; }
    if (d >= 95) out.egg = "melt";
    if (ctx.last && ctx.last === t) { out.repeat = ctx.repeats > 1 ? "This is now the delusion." : "Asking again won't change the evidence."; out.egg = "repeat"; }
    if (ctx.count >= 5 && ctx.count % 5 === 0) out.repeat = "That's " + ctx.count + " situations. At this point it's a lifestyle.";
    return out;
  }
  function makeWorse(a, level) {
    const w = worse[Math.min(level, worse.length - 1)];
    return Object.assign({}, a, { delusion:clamp(a.delusion + 9), overthinking:clamp(a.overthinking + 11), verdict:w[0], reality:w[1], advice:level >= 4 ? "Stop. This is the end of the road. Nothing gets worse than this." : R(["Close the imaginary courtroom.","Call a friend. A real one.","Drink water, then lie down."]), face:level >= 4 ? "💀" : "😵‍💫", tag:"WORSE", escalated:true, egg:level >= 4 ? "worse5" : a.egg });
  }
  const random = ["He liked my 2019 photo at 2:14 AM but said nothing.","My manager said 'Thanks!' with an exclamation mark. Is she mad?","They saw my story in 2 minutes and didn't reply. Am I cooked?","I saw 11:11 three times today. The universe is texting me.","My friend laughed at someone else's joke more than mine.","They typed for 4 minutes then sent 'ok'.","My crush looked at me. Or at the wall behind me. Same energy.","Mercury is in retrograde and my latte art looks like a sign.","I rewatched our chat 9 times and I'm sure the comma is passive aggressive."];
  const grass = [["Grass department dispatched.","Look at something that isn't your phone for 30 seconds."],["Emergency grounding protocol.","Name five things you can see. None are notifications."],["Touch grass: pending.","Stand up. Stretch. Drink water. Let the courtroom adjourn."],["Real grass count: still 0.","Photos of grass do not count. We checked."]];
  return { loading, analyze, makeWorse, tier, faceOf, random, grass, dex, found, unlock, R, clamp };
})();
