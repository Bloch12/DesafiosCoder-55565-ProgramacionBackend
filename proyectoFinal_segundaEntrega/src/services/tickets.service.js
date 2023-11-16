import { TicketsMongoDAO  as DAO} from "../dao/ticketsMongoDAO.js";

class TicketService{
    constructor(dao){
        this.dao = dao;
    }

    async createTicket(ticket){
        return await this.dao.create(ticket);
    }

}

export const ticketService = new TicketService(DAO);