import { AddressCardProps } from "@/type/address";
import {Button, Card, CardBody} from "@nextui-org/react";
import { ReactNode } from "react";

export default function AddressCard({address, onSelect}: AddressCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between p-4 border-primary border">
      <CardBody className="flex flex-col">
      <p className="text-sm text-gray-500">{address.label}</p>
        <p className="font-bold">{address.recipient}</p>
        <p>{address.phoneNumber}</p>
        <p>{address.addressLine}</p>
      </CardBody>
      <Button color="primary" variant="ghost" onClick={onSelect}>
        Pilih
      </Button>
    </Card>
  );
}