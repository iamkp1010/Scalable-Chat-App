# Scalable Chat Application

A highly scalable and efficient real-time chat application built using the MERN stack, with Kafka and Redis to ensure seamless performance under heavy loads.

## Features

- **Real-Time Messaging**: Instant message delivery using Socket.io for real-time communication.
- **Group Chats**: Users can create, join, and manage group chats effortlessly.
- **User Authentication**: Secure authentication with JWT and Single Sign-On (SSO) using OAuth.
- **Emoji Support**: Users can send and receive emojis within chats.
- **Responsive Design**: Fully responsive UI, optimized for all device types.

## Scalability and Performance Enhancements

### Kafka - Distributed Messaging System

Kafka serves as the backbone for handling real-time messaging in the application. By decoupling message producers and consumers, Kafka ensures that the application remains scalable and highly responsive, even under heavy traffic.

- **High Throughput**: Kafka manages high message volumes efficiently, allowing the application to support a large number of concurrent users without performance degradation.
- **Horizontal Scalability**: Easily scale Kafka by adding more brokers and partitions, ensuring the system can handle increasing traffic seamlessly.
- **Fault Tolerance**: Kafka guarantees reliable message delivery, ensuring that no messages are lost in case of system failures.

### Redis - In-Memory Caching

Redis is used to cache frequently accessed data, improving both performance and scalability.

- **Efficient Data Synchronization**: Redis Pub/Sub helps synchronize messages across servers, ensuring real-time data consistency.
- **Low Latency**: Redis provides fast read and write operations for caching user sessions and chat data, reducing database load and speeding up message retrieval.
- **Horizontal Scalability**: Redis can be scaled across multiple nodes, enabling the application to handle large-scale traffic.

## Technologies Used

### Backend

- KafkaJS
- Redis
- MongoDB
- Socket.io
- Node.js
- Express

### Frontend

- React
- Redux Toolkit
- Tailwind CSS
