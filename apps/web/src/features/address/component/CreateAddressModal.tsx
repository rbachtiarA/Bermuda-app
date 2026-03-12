import * as yup from 'yup';
interface Props {
  isOpen: boolean;
}

const formValidationSchema = yup.object().shape({
  label: yup.string().required('Masukkan rumah/kantor/kos/dll'),
  recipient: yup.string().required('Masukkan nama penerima'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, 'Hanya angka yang diperbolehkan')
    .required('Masukkan nomor handphone penerima'),
  addressLine: yup
    .string()
    .required('Masukkan nama jalan/nama bangunan/lantai/nomor rumah atau unit'),
});

export default function CreateAddressModal({}: Props) {}
