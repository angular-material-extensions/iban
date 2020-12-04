/** Data structure for holding telephone number. */
// tslint:disable-next-line:class-name
export class IBAN_DE {
  constructor(
    public country: string,
    public checksum: string,
    public bankCode: { part1: string, part2: string },
    public bankAccountNumber: { part1: string, part2: string, part3: string }
  ) {
  }
}
