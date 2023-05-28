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
  rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Row numbers
  seatsPerRow = 7; // Number of seats in each row
  lastRowSeats = 3; // Number of seats in the last row
  seats: Seat[] = [];
  numSeats: number;

  constructor() {
    // Initialize seats with default values
    let id = 1;
    for (let row = 1; row <= this.rows.length; row++) {
      const seatsInRow =
        row === this.rows.length ? this.lastRowSeats : this.seatsPerRow;
      for (let seatNumber = 1; seatNumber <= seatsInRow; seatNumber++) {
        this.seats.push({
          id,
          row,
          seatNumber,
          isReserved: false,
        });
        id++;
      }
    }
  }

  reserveSeats(numSeats: number) {
    const availableSeats = this.getAvailableSeats();
    if (availableSeats.length < numSeats) {
      alert('Sorry, there are not enough seats available!');
      return;
    }

    // Try to reserve seats in one row if possible
    for (let row = 1; row <= this.rows.length; row++) {
      const rowSeats = availableSeats.filter((seat) => seat.row === row);
      if (rowSeats.length >= numSeats) {
        rowSeats.slice(0, numSeats).forEach((seat) => (seat.isReserved = true));
        alert(`Successfully reserved ${numSeats} seats in row ${row}!`);
        return;
      }
    }

    // Reserve seats in nearby rows
    let reservedSeats: Seat[] = [];
    for (let i = 1; i <= numSeats; i++) {
      const seat = availableSeats.find(
        (s) => !reservedSeats.includes(s) && !this.isSeatNextToReserved(s)
      );
      if (seat) {
        seat.isReserved = true;
        reservedSeats.push(seat);
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