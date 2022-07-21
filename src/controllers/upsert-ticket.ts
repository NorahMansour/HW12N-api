export function upserTicketController(ticket: any[], newTicket: any) {
  const ticketIndex = ticket.findIndex((el) => el.id === newTicket.id);
  if (ticketIndex === -1) {
    ticket.push(newTicket);
  } else {
    ticket[ticketIndex] = {
      ...ticket[ticketIndex],
      ...newTicket,
    };
  }
  return ticket;
}
