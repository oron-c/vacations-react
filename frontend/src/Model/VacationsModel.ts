class VacationsModel {
    constructor (
        public vacationId: number,
        public description: string, 
        public destinationId: number,
        public image: string | any, 
        public dateStart: string, 
        public dateEnd: string,
        public price: number,
        public followers: number,
        public destinationName: string
        ) {}
}

export default VacationsModel