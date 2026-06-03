# Stage 1 - Notification API Design

## Core Actions

1. Create Notification
2. Get All Notifications
3. Get Notification By ID
4. Mark Notification As Read
5. Delete Notification
6. Real-Time Notification Delivery

## REST APIs

### Create Notification

POST /api/v1/notifications

Request:

```json
{
  "studentId": 1042,
  "title": "Placement Result",
  "message": "Congratulations! You have been shortlisted.",
  "notificationType": "Placement"
}
```

Response:

```json
{
  "id": "uuid",
  "status": "created"
}
```

### Get Notifications

GET /api/v1/notifications?studentId=1042

Response:

```json
[
  {
    "id": "uuid",
    "title": "Placement Result",
    "message": "Congratulations!",
    "notificationType": "Placement",
    "isRead": false,
    "createdAt": "2026-04-22T17:51:30Z"
  }
]
```

### Get Notification By ID

GET /api/v1/notifications/{id}

### Mark Notification As Read

PATCH /api/v1/notifications/{id}/read

Response:

```json
{
  "status": "success"
}
```

### Delete Notification

DELETE /api/v1/notifications/{id}

## Notification Schema

```json
{
  "id": "uuid",
  "studentId": 1042,
  "title": "Placement Result",
  "message": "Congratulations!",
  "notificationType": "Placement",
  "isRead": false,
  "createdAt": "timestamp"
}
```

## Real-Time Notifications

WebSockets will be used for real-time delivery because they provide persistent bidirectional communication and low latency updates.

````

# Stage 2 - Database Design

## Database Choice

PostgreSQL

### Reasons

- ACID compliance
- Strong consistency
- Excellent indexing support
- Efficient querying of notification data

## Schema

### Students

```sql
CREATE TABLE students(
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);
````

### Notifications

```sql
CREATE TABLE notifications(
    id UUID PRIMARY KEY,
    student_id BIGINT,
    title TEXT,
    message TEXT,
    notification_type VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
);
```

## Scaling Challenges

* Large table growth
* Slow queries
* Heavy read traffic

## Solutions

* Indexing
* Partitioning
* Read replicas
* Redis caching

````

# Stage 3 - Query Optimization

Query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
````

## Why It Is Slow

With millions of rows the database may perform a large scan before filtering results.

## Better Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

## Why Not Index Every Column

Adding indexes everywhere increases:

* Storage consumption
* Insert cost
* Update cost
* Maintenance overhead

Indexes should only be added to frequently queried columns.

## Students Receiving Placement Notifications In Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

```

# Stage 4 - Performance Improvements

## Problem

Notifications are fetched from the database on every page load.

## Solutions

### Redis Cache

Store unread notifications in Redis to reduce database load.

### Read Replicas

Direct heavy read traffic to replicas.

### Pagination

Load notifications in chunks instead of loading everything.

### WebSockets

Push notifications to users instead of repeated polling.

## Tradeoffs

Redis introduces cache invalidation complexity.

Read replicas introduce replication lag.

WebSockets increase server memory usage.
```

# Stage 5 - Notify All Architecture

The provided implementation is sequential and will be extremely slow for 50,000 users.

## Improved Architecture

1. Publish notification event.
2. Push event into a message queue.
3. Multiple workers process users concurrently.
4. Email service sends emails.
5. Notification service stores records.
6. WebSocket service pushes real-time updates.

### Recommended Technologies

* RabbitMQ
* Kafka
* Redis Streams

## Benefits

* Horizontal scalability
* Fault tolerance
* Retry mechanisms
* Faster processing

````

# Stage 6 - Priority Inbox

## Priority Calculation

Weight:

Placement = 3

Result = 2

Event = 1

Score Formula:

Priority Score = Type Weight × 100 + Recency Score

## Algorithm

Maintain a Min Heap of size 10.

Complexity:

- Insert: O(log n)
- Retrieve Top 10: O(1)

This efficiently maintains the highest priority unread notifications as new notifications arrive.

## Sample JavaScript Implementation

```js
function getWeight(type) {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  return 1;
}

function priority(notification) {
  return (
    getWeight(notification.Type) * 100 +
    new Date(notification.Timestamp).getTime()
  );
}
````
