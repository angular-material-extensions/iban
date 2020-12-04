import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, Inject, Input, OnDestroy, Optional, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl, Validators } from '@angular/forms';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { IBAN_DE } from '../iban.de';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-iban-de',
  templateUrl: './mat-iban-de.component.html',
  styleUrls: ['./mat-iban-de.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: MatIbanDeComponent }],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id'
  }
})
export class MatIbanDeComponent implements ControlValueAccessor, MatFormFieldControl<IBAN_DE>, OnDestroy {

  static nextId = 0;
  @ViewChild('country') areaInput!: HTMLInputElement;
  @ViewChild('checksum') exchangeInput!: HTMLInputElement;
  @ViewChild('subscriber') subscriberInput!: HTMLInputElement;

  parts!: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  controlType = 'mat-iban-de';
  id = `mat-iban-det-${MatIbanDeComponent.nextId++}`;
  onChange = (_: any) => {
  };
  onTouched = () => {
  };


  get empty(): boolean {
    const {
      value: { country, checksum, bankCode, bankAccountNumber }
    } = this.parts;

    return !country && !checksum && !bankCode && !bankAccountNumber;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input('aria-describedby') userAriaDescribedBy!: string;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  // tslint:disable-next-line:variable-name
  private _placeholder!: string;

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  // tslint:disable-next-line:variable-name
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  // tslint:disable-next-line:variable-name
  private _disabled = false;

  @Input()
  get value(): IBAN_DE | null {
    if (this.parts.valid) {
      const {
        value: { country, checksum, bankCode, bankAccountNumber }
      } = this.parts;
      return new IBAN_DE(country, checksum, bankCode, bankAccountNumber);
    }
    return null;
  }

  set value(tel: IBAN_DE | null) {
    const { country, checksum, bankCode, bankAccountNumber } = tel || new IBAN_DE('', '', { part1: '', part2: '' }, {
      part1: '',
      part2: '',
      part3: ''
    });
    this.parts.setValue({ country, checksum, bankCode, bankAccountNumber });
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.parts.dirty;
  }

  constructor(
    formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl) {

    this.parts = formBuilder.group({
      country: [
        null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)]
      ],
      checksum: [
        null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)]
      ],
      bankCode: formBuilder.group({
        part1: [
          null,
          [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
        ],
        part2: [
          null,
          [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
        ]
      }),
      bankAccountNumber: formBuilder.group({
        part1: [
          null,
          [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
        ],
        part2: [
          null,
          [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
        ],
        part3: [
          null,
          [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
        ]
      })
    });

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      // @ts-ignore
      this.ngControl.valueAccessor = this;
    }
  }


  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  setDescribedByIds(ids: string[]): void {
    const controlElement = this._elementRef.nativeElement
      .querySelector('.example-tel-input-container')!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(): void {
    if (this.parts.controls.subscriber.valid) {
      this._focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.parts.controls.exchange.valid) {
      this._focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.parts.controls.area.valid) {
      this._focusMonitor.focusVia(this.exchangeInput, 'program');
    } else {
      this._focusMonitor.focusVia(this.areaInput, 'program');
    }
  }

  writeValue(iban: IBAN_DE | null): void {
    this.value = iban;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  // tslint:disable-next-line:variable-name
  static ngAcceptInputType_disabled: boolean | string | null | undefined;
  // tslint:disable-next-line:variable-name
  static ngAcceptInputType_required: boolean | string | null | undefined;
}
