# Stage 1

## Core Actions
- Create notification
- Fetch notifications
- Mark notification as read
- Delete notification

## APIs

GET /notifications
POST /notifications
PATCH /notifications/{id}/read
DELETE /notifications/{id}

## Real-Time Notifications
Use WebSockets for instant delivery to connected users.

---

# Stage 2

## Database Choice
PostgreSQL

## Schema

Students
- id
- name
- email

Notifications
- id
- student_id
- type
- message
- is_read
- created_at

## Scaling
- Indexing
- Pagination
- Partitioning

---

# Stage 3

## Problem
Query scans a large notification table and sorts results.

## Better Index
(student_id, is_read, created_at DESC)

## Complexity
Before: O(N log N)

After: O(log N)

## Placement Notifications Last 7 Days

SELECT *
FROM notifications
WHERE notificationType='Placement'
AND createdAt >= NOW() - INTERVAL '7 days';

## Indexing Every Column?
No.
Extra indexes increase storage and slow writes.

---

# Stage 4

## Improvements
- Redis caching
- Pagination
- Lazy loading
- WebSocket push notifications
- Read replicas

## Tradeoffs
More infrastructure but much lower database load.

---

# Stage 5

## Problem
50,000 users notified sequentially.

## Solution
Use message queues (RabbitMQ/Kafka).

Flow:
HR -> Queue -> Workers -> Email/App Notification

Benefits:
- Scalable
- Fault tolerant
- Faster delivery

---

# Stage 6

## Priority Inbox

Priority Weights:
- Placement = 3
- Result = 2
- Event = 1

Priority Score:
(weight × 1000) + recency

Top 10 notifications are selected after sorting by score.

## Handling New Notifications

Maintain a min-heap of size 10.

Complexity:
O(log 10) per insertion.