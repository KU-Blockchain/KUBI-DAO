// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Proposal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Proposal entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Proposal must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Proposal", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Proposal | null {
    return changetype<Proposal | null>(store.get_in_block("Proposal", id));
  }

  static load(id: string): Proposal | null {
    return changetype<Proposal | null>(store.get("Proposal", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get description(): string {
    let value = this.get("description");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set description(value: string) {
    this.set("description", Value.fromString(value));
  }

  get execution(): string {
    let value = this.get("execution");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set execution(value: string) {
    this.set("execution", Value.fromString(value));
  }

  get totalVotes(): BigInt {
    let value = this.get("totalVotes");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set totalVotes(value: BigInt) {
    this.set("totalVotes", Value.fromBigInt(value));
  }

  get timeInMinutes(): BigInt {
    let value = this.get("timeInMinutes");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timeInMinutes(value: BigInt) {
    this.set("timeInMinutes", Value.fromBigInt(value));
  }

  get creationTimestamp(): BigInt {
    let value = this.get("creationTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set creationTimestamp(value: BigInt) {
    this.set("creationTimestamp", Value.fromBigInt(value));
  }

  get expirationTimestamp(): BigInt {
    let value = this.get("expirationTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set expirationTimestamp(value: BigInt) {
    this.set("expirationTimestamp", Value.fromBigInt(value));
  }

  get options(): PollOptionLoader {
    return new PollOptionLoader(
      "Proposal",
      this.get("id")!.toString(),
      "options"
    );
  }
}

export class PollOption extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save PollOption entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type PollOption must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("PollOption", id.toString(), this);
    }
  }

  static loadInBlock(id: string): PollOption | null {
    return changetype<PollOption | null>(store.get_in_block("PollOption", id));
  }

  static load(id: string): PollOption | null {
    return changetype<PollOption | null>(store.get("PollOption", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get proposal(): string {
    let value = this.get("proposal");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set proposal(value: string) {
    this.set("proposal", Value.fromString(value));
  }

  get optionIndex(): BigInt {
    let value = this.get("optionIndex");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set optionIndex(value: BigInt) {
    this.set("optionIndex", Value.fromBigInt(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get votes(): BigInt {
    let value = this.get("votes");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set votes(value: BigInt) {
    this.set("votes", Value.fromBigInt(value));
  }
}

export class Vote extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Vote entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Vote must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Vote", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Vote | null {
    return changetype<Vote | null>(store.get_in_block("Vote", id));
  }

  static load(id: string): Vote | null {
    return changetype<Vote | null>(store.get("Vote", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get proposal(): string {
    let value = this.get("proposal");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set proposal(value: string) {
    this.set("proposal", Value.fromString(value));
  }

  get voter(): Bytes {
    let value = this.get("voter");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set voter(value: Bytes) {
    this.set("voter", Value.fromBytes(value));
  }

  get optionIndex(): BigInt {
    let value = this.get("optionIndex");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set optionIndex(value: BigInt) {
    this.set("optionIndex", Value.fromBigInt(value));
  }
}

export class PollOptionLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): PollOption[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<PollOption[]>(value);
  }
}
