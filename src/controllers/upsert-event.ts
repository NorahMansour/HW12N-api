export function upsertEventsController(events: any[], newEvent: any) {
	const eventIndex = events.findIndex((el) => el.id === newEvent.id);
	if (eventIndex === -1) {
		events.push(newEvent);
	} else {
		events[eventIndex] = {
			...events[eventIndex],
			...newEvent,
		};
	}
	return events;
}
