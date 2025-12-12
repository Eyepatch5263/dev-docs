export type FlashcardCategory = 'dbms' | 'os' | 'networking' | 'system-design';

export interface Flashcard {
    id: string;
    category: FlashcardCategory;
    question: string;
    answer: string;
}

export interface CategoryInfo {
    id: FlashcardCategory;
    name: string;
    icon: string;
    color: string;
    description: string;
}

export const categories: CategoryInfo[] = [
    {
        id: 'dbms',
        name: 'Database Management',
        icon: 'Database',
        color: 'oklch(0.6 0.2 240)',
        description: 'Master database concepts, indexing, and normalization'
    },
    {
        id: 'os',
        name: 'Operating Systems',
        icon: 'Cpu',
        color: 'oklch(0.6 0.2 140)',
        description: 'Learn about processes, threads, and memory management'
    },
    {
        id: 'networking',
        name: 'Networking',
        icon: 'Network',
        color: 'oklch(0.6 0.2 40)',
        description: 'Understand protocols, DNS, and network architecture'
    },
    {
        id: 'system-design',
        name: 'System Design',
        icon: 'Boxes',
        color: 'oklch(0.6 0.2 280)',
        description: 'Design scalable systems with load balancing and caching'
    }
];

export const flashcards: Flashcard[] = [
    // DBMS
    {
        id: 'dbms-1',
        category: 'dbms',
        question: 'What is an index in a database?',
        answer: 'A data structure that improves the speed of data retrieval operations on a database table. It works like a book index, using pointers to quickly locate data without scanning every row.'
    },
    {
        id: 'dbms-2',
        category: 'dbms',
        question: 'What is normalization?',
        answer: 'The process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them.'
    },
    {
        id: 'dbms-3',
        category: 'dbms',
        question: 'What is ACID in databases?',
        answer: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. These are properties that guarantee database transactions are processed reliably, ensuring data integrity even in case of errors or system failures.'
    },
    {
        id: 'dbms-4',
        category: 'dbms',
        question: 'What is the difference between SQL and NoSQL?',
        answer: 'SQL databases are relational, use structured schemas, and support ACID transactions. NoSQL databases are non-relational, have flexible schemas, and are designed for horizontal scaling and handling unstructured data.'
    },
    {
        id: 'dbms-5',
        category: 'dbms',
        question: 'What is a primary key?',
        answer: 'A unique identifier for each record in a database table. It must contain unique values and cannot contain NULL values. Each table can have only one primary key.'
    },
    {
        id: 'dbms-6',
        category: 'dbms',
        question: 'What is a foreign key?',
        answer: 'A field in one table that refers to the primary key in another table. It creates a link between two tables and enforces referential integrity by ensuring the value exists in the referenced table.'
    },
    {
        id: 'dbms-7',
        category: 'dbms',
        question: 'What is database sharding?',
        answer: 'A database partitioning technique that splits large databases into smaller, faster, more manageable parts called shards. Each shard is held on a separate database server instance to spread the load.'
    },
    {
        id: 'dbms-8',
        category: 'dbms',
        question: 'What is a transaction?',
        answer: 'A sequence of database operations that are treated as a single unit of work. All operations must complete successfully, or none of them will be applied, ensuring data consistency.'
    },

    // OS
    {
        id: 'os-1',
        category: 'os',
        question: 'What is a process?',
        answer: 'An executing instance of a program with its own memory space, including code, data, and system resources. Each process runs independently and is isolated from other processes.'
    },
    {
        id: 'os-2',
        category: 'os',
        question: 'What is a thread?',
        answer: 'A lightweight unit of execution within a process that shares memory and resources with other threads in the same process. Threads enable concurrent execution and are more efficient than creating separate processes.'
    },
    {
        id: 'os-3',
        category: 'os',
        question: 'What is virtual memory?',
        answer: 'A memory management technique that creates an illusion of a large, contiguous memory space by using both RAM and disk storage. It allows programs to use more memory than physically available.'
    },
    {
        id: 'os-4',
        category: 'os',
        question: 'What is a deadlock?',
        answer: 'A situation where two or more processes are unable to proceed because each is waiting for the other to release a resource. It occurs when four conditions are met: mutual exclusion, hold and wait, no preemption, and circular wait.'
    },
    {
        id: 'os-5',
        category: 'os',
        question: 'What is context switching?',
        answer: 'The process of storing and restoring the state of a process or thread so that execution can be resumed later. It allows multiple processes to share a single CPU and is essential for multitasking.'
    },
    {
        id: 'os-6',
        category: 'os',
        question: 'What is paging?',
        answer: 'A memory management scheme that eliminates the need for contiguous allocation of physical memory. It divides memory into fixed-size blocks called pages and maps them to physical frames.'
    },
    {
        id: 'os-7',
        category: 'os',
        question: 'What is the difference between kernel mode and user mode?',
        answer: 'Kernel mode has unrestricted access to all hardware and system resources, while user mode has limited access. Programs run in user mode and switch to kernel mode via system calls to access protected resources.'
    },
    {
        id: 'os-8',
        category: 'os',
        question: 'What is a semaphore?',
        answer: 'A synchronization primitive used to control access to shared resources in concurrent programming. It maintains a counter that gets incremented or decremented to signal resource availability.'
    },

    // Networking
    {
        id: 'net-1',
        category: 'networking',
        question: 'What is TCP?',
        answer: 'Transmission Control Protocol - a reliable, connection-oriented transport layer protocol that ensures data is delivered in order and without errors. It uses acknowledgments and retransmission to guarantee delivery.'
    },
    {
        id: 'net-2',
        category: 'networking',
        question: 'What is DNS?',
        answer: 'Domain Name System - a hierarchical naming system that translates human-readable domain names (like google.com) into IP addresses that computers use to identify each other on the network.'
    },
    {
        id: 'net-3',
        category: 'networking',
        question: 'What is the difference between TCP and UDP?',
        answer: 'TCP is connection-oriented, reliable, and ensures ordered delivery but has higher overhead. UDP is connectionless, faster, but doesn\'t guarantee delivery or order. UDP is used for real-time applications like video streaming.'
    },
    {
        id: 'net-4',
        category: 'networking',
        question: 'What is HTTP/HTTPS?',
        answer: 'HTTP (Hypertext Transfer Protocol) is an application layer protocol for transmitting web pages. HTTPS is the secure version that encrypts data using TLS/SSL to protect against eavesdropping and tampering.'
    },
    {
        id: 'net-5',
        category: 'networking',
        question: 'What is a subnet mask?',
        answer: 'A 32-bit number that divides an IP address into network and host portions. It determines which part of the IP address identifies the network and which part identifies the specific device on that network.'
    },
    {
        id: 'net-6',
        category: 'networking',
        question: 'What is NAT?',
        answer: 'Network Address Translation - a method of mapping private IP addresses to public IP addresses. It allows multiple devices on a local network to share a single public IP address for internet access.'
    },
    {
        id: 'net-7',
        category: 'networking',
        question: 'What is the OSI model?',
        answer: 'A conceptual framework with 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application) that standardizes network communication functions. It helps understand how data flows through a network.'
    },
    {
        id: 'net-8',
        category: 'networking',
        question: 'What is a CDN?',
        answer: 'Content Delivery Network - a geographically distributed network of servers that cache and deliver content to users from the nearest location, reducing latency and improving load times for websites and applications.'
    },

    // System Design
    {
        id: 'sd-1',
        category: 'system-design',
        question: 'What is load balancing?',
        answer: 'The distribution of network traffic across multiple servers to ensure no single server becomes overwhelmed. It improves application availability, reliability, and performance by spreading the workload evenly.'
    },
    {
        id: 'sd-2',
        category: 'system-design',
        question: 'What is caching?',
        answer: 'Temporarily storing frequently accessed data in a fast-access storage layer (like memory) to reduce retrieval time and database load. Common caching strategies include LRU, LFU, and write-through/write-back.'
    },
    {
        id: 'sd-3',
        category: 'system-design',
        question: 'What is horizontal vs vertical scaling?',
        answer: 'Horizontal scaling (scale-out) adds more machines to distribute load, while vertical scaling (scale-up) adds more resources to existing machines. Horizontal scaling is more flexible and fault-tolerant.'
    },
    {
        id: 'sd-4',
        category: 'system-design',
        question: 'What is a microservices architecture?',
        answer: 'An architectural style that structures an application as a collection of small, independent services that communicate via APIs. Each service is focused on a specific business capability and can be developed and deployed independently.'
    },
    {
        id: 'sd-5',
        category: 'system-design',
        question: 'What is CAP theorem?',
        answer: 'States that a distributed system can only guarantee two of three properties: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition tolerance (system continues despite network failures).'
    },
    {
        id: 'sd-6',
        category: 'system-design',
        question: 'What is a message queue?',
        answer: 'An asynchronous communication method where messages are stored in a queue until they are processed. It decouples services, enables load leveling, and provides fault tolerance. Examples include RabbitMQ and Apache Kafka.'
    },
    {
        id: 'sd-7',
        category: 'system-design',
        question: 'What is database replication?',
        answer: 'The process of copying data from one database to another to ensure data availability and reliability. Common patterns include master-slave (read replicas) and master-master (multi-master) replication.'
    },
    {
        id: 'sd-8',
        category: 'system-design',
        question: 'What is rate limiting?',
        answer: 'A technique to control the number of requests a user or service can make in a given time period. It prevents abuse, ensures fair resource usage, and protects against DDoS attacks. Common algorithms include token bucket and leaky bucket.'
    }
];

// Utility functions
export function getFlashcardsByCategory(category: FlashcardCategory): Flashcard[] {
    return flashcards.filter(card => card.category === category);
}

export function getCategoryInfo(category: FlashcardCategory): CategoryInfo | undefined {
    return categories.find(cat => cat.id === category);
}

export function shuffleDeck<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function getAllCategories(): CategoryInfo[] {
    return categories;
}
