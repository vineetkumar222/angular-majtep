import { Component } from '@angular/core';

interface Seat {
  id: number;
  row: number;
  seatNumber: number;
  isReserved: boolean;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  rows: number[] = []; // Row numbers
  seatsPerRow: number;
  seats: Seat[] = [];
  numSeats: number;
  totalSeats: number;

  constructor() {}

  setValues(totalSeats: number, seatsPerRow: number) {
    this.rows = [];
    this.totalSeats = totalSeats;
    this.seatsPerRow = seatsPerRow;
    this.initializeSeats();
  }

  initializeSeats() {
    this.rows = Array.from(
      { length: Math.ceil(this.totalSeats / this.seatsPerRow) },
      (_, i) => i + 1
    );

    this.seats = [];
    let id = 1;
    let currentSeatNumber = 1;
    for (let row = 1; row <= this.rows.length; row++) {
      for (let seatNumber = 1; seatNumber <= this.seatsPerRow; seatNumber++) {
        if (currentSeatNumber <= this.totalSeats) {
          this.seats.push({
            id,
            row,
            seatNumber: currentSeatNumber,
            isReserved: false,
          });
          id++;
          currentSeatNumber++;
        }
      }
    }
  }

  reserveSeats(numSeats: number) {
    const availableSeats = this.getAvailableSeats();
    if (availableSeats.length < numSeats) {
      alert('Sorry, there are not enough seats available!');
      return;
    }

    // Try to reserve seats in one row if possible and the number of empty seats is equal to numSeats
    for (let row = 1; row <= this.rows.length; row++) {
      const rowSeats = availableSeats.filter((seat) => seat.row === row);
      if (rowSeats.length === numSeats) {
        rowSeats.forEach((seat) => (seat.isReserved = true));
        alert(`Successfully reserved ${numSeats} seats in row ${row}!`);
        return;
      }
    }

    // Try to reserve seats in one row if possible and the number of empty seats is greater than numSeats
    for (let row = 1; row <= this.rows.length; row++) {
      const rowSeats = availableSeats.filter((seat) => seat.row === row);
      if (rowSeats.length > numSeats) {
        rowSeats.slice(0, numSeats).forEach((seat) => (seat.isReserved = true));
        alert(`Successfully reserved ${numSeats} seats in row ${row}!`);
        return;
      }
    }

    // Reserve nearby seats
    const reservedSeats: Seat[] = [];
    for (let i = 0; i < numSeats; i++) {
      const nearbySeats = availableSeats.filter(
        (seat) =>
          !reservedSeats.includes(seat) && this.isSeatNextToReserved(seat)
      );
      if (nearbySeats.length > 0) {
        const seatToReserve = nearbySeats[0];
        seatToReserve.isReserved = true;
        reservedSeats.push(seatToReserve);
      } else {
        // If there are not enough nearby seats available, cancel the reservation
        reservedSeats.forEach((s) => (s.isReserved = false));
        alert('Sorry, there are not enough nearby seats available!');
        return;
      }
    }

    alert(`Successfully reserved ${numSeats} seats!`);
  }

  // Returns all available seats that are not reserved
  getAvailableSeats(): Seat[] {
    return this.seats.filter((seat) => !seat.isReserved);
  }

  // Checks if a seat is next to a reserved seat
  isSeatNextToReserved(seat: Seat): boolean {
    const nearbySeats = this.seats.filter(
      (s) =>
        Math.abs(s.row - seat.row) <= 1 &&
        Math.abs(s.seatNumber - seat.seatNumber) <= 1
    );
    return nearbySeats.some((s) => s.isReserved);
  }
}
