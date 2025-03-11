# System Architecture

## Temporal Handling Strategy

### Storage
- All dates stored as UTC timestamps
- Database columns use `TIMESTAMP WITH TIME ZONE`

### Business Logic
```typescript
// Conversion example
const storedDateUTC = '2024-12-25T06:00:00Z';
const displayDate = toProjectTime(new Date(storedDateUTC));
```

### Testing
- Use explicit UTC strings in test fixtures
- Validate timezone conversion in critical paths
