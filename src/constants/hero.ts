export const techNodes = [
    { name: 'Load Balancer', status: 'routing requests...', color: 'bg-amber-500', posClass: 'left-[4%] top-[20%] md:left-[8%] md:top-[22%]' },
    { name: 'RAG Pipeline', status: 'retrieving context...', color: 'bg-blue-500', posClass: 'right-[4%] top-[18%] md:right-[8%] md:top-[20%]' },
    { name: 'OAuth 2.0', status: 'authorizing client...', color: 'bg-rose-500', posClass: 'left-[4%] bottom-[20%] md:left-[12%] md:bottom-[22%]' },
    { name: 'Kernel Task', status: 'scheduling thread...', color: 'bg-emerald-500', posClass: 'right-[4%] bottom-[22%] md:right-[12%] md:bottom-[25%]' },
    { name: 'TCP Handshake', status: 'establishing link...', color: 'bg-cyan-500', posClass: 'hidden md:flex left-[28%] top-[15%]' },
    { name: 'Docker Daemon', status: 'building image...', color: 'bg-purple-500', posClass: 'hidden md:flex right-[28%] bottom-[15%]' },
];

export const codeSnippets = [
    { text: 'await brain.think()', posClass: 'left-[10%] top-[45%] md:left-[18%]', delay: 0 },
    { text: 'docker run -d redis', posClass: 'right-[8%] top-[55%] md:right-[15%]', delay: 1.5 },
    { text: 'token = jwt.sign(user)', posClass: 'left-[6%] bottom-[35%] md:left-[6%] md:bottom-[45%]', delay: 0.8 },
    { text: 'ping -c 3 8.8.8.8', posClass: 'hidden md:block right-[22%] top-[10%]', delay: 2.2 },
    { text: 'tf.keras.layers.Dense()', posClass: 'hidden md:block left-[35%] top-[8%]', delay: 1.2 },
    { text: 'iptables -A INPUT -j DROP', posClass: 'hidden md:block right-[35%] bottom-[8%]', delay: 2.5 },
];
