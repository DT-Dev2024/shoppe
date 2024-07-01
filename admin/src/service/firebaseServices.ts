import {
  setDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { DEFAULT_PASSWORD, ID_PREFIX, MAX_ID_NUMB } from '../config/constants';
import { firestoreDb } from '../firebase';
import bcryptjs from 'bcryptjs';
import { TAccount } from '../types/User';
import moment from 'moment';

export const generateNewUserData = async () => {
  const userDocs = await getDocs(collection(firestoreDb, 'user'));
  const lastUserId = userDocs.docs[userDocs.size - 1].id;

  let idNumb = `${Number(lastUserId.slice(2)) + 1}`;

  if (idNumb.length < MAX_ID_NUMB) {
    idNumb = '0'.repeat(MAX_ID_NUMB - idNumb.length) + idNumb;
  }

  const resultData: TAccount = {
    id: ID_PREFIX.USER + idNumb,
    taxId: ID_PREFIX.TAX + idNumb,
    salaryId: ID_PREFIX.SALARY + idNumb,
    insuranceId: ID_PREFIX.INSURANCE + idNumb,
    name: '',
    gender: 0,
    dob: moment(),
    mail: '',
    phone: '',
    address: '',
    status: 1,
    cccd: '',
    educationLevel: 0,
  };

  return resultData;
};

export const getUserDetail = async (userId: string) => {
  const querySalaryData = query(
    collection(firestoreDb, 'insurance'),
    where('userId', '==', userId)
  );

  const salaryData = await getDocs(querySalaryData);
  console.log(salaryData.docs[0].data());
};

export const requestLogin = async ({ username, password }: any) => {
  const q = query(
    collection(firestoreDb, 'user'),
    where('phone', '==', username)
  );

  const querySnapshot = await getDocs(q);
  const user = querySnapshot.docs[0]?.data();

  if (!user) return { status: 0 };

  const userPass = user.password;
  const isMatch = await bcryptjs.compare(password, userPass);

  if (!isMatch) return { status: 0 };
  else return { status: 1, data: user };
};

const upadteUserData = (data: TAccount) => {
  const userRef = doc(firestoreDb, 'user', data.id);

  let dataUpdate = {
    ...data,
    dob: Timestamp.fromDate(moment(data.dob).toDate()),
  };

  return updateDoc(userRef, dataUpdate);
};

const changeUserStatus = (userId: string, status: number) => {
  const userRef = doc(firestoreDb, 'user', userId);
  let dataUpdate = {
    status,
  };

  return updateDoc(userRef, dataUpdate);
};

const createNewUser = async (data: TAccount) => {
  const userRef = doc(firestoreDb, 'user', data.id);

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(DEFAULT_PASSWORD, salt);

  let dataCreate = {
    ...data,
    dob: Timestamp.fromDate(data.dob.toDate()),
    password: hashedPassword,
  };

  await setDoc(userRef, dataCreate);
  // await addDoc(collection(firestoreDb, 'insurance'), {
  //   insuranceId: data.insuranceId,
  //   userId: data.id
  // })
  // await addDoc(collection(firestoreDb, 'insurance'), {
  //   insuranceId: data.insuranceId,
  //   userId: data.id
  // })
  // await addDoc(collection(firestoreDb, 'insurance'), {
  //   insuranceId: data.insuranceId,
  //   userId: data.id
  // })
};

const removeUser = async (userId: string) => {
  await deleteDoc(doc(firestoreDb, 'user', userId));
};

const requestChangePass = async (
  userId: string,
  oldPwd: string,
  newPwd: string
) => {
  const userRef = doc(firestoreDb, 'user', userId);
  const user = (await getDoc(userRef)).data();

  if (!user) return { status: 0, msg: 'Không tìm thấy người dùng' };

  const userPass = user.password;
  const isMatch = await bcryptjs.compare(oldPwd, userPass);

  if (!isMatch) return { status: 0, msg: 'Mật khẩu cũ không trùng khớp' };

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(newPwd, salt);

  await updateDoc(userRef, { password: hashedPassword });
  return { status: 1, msg: 'Đổi mật khẩu thành công' };
};

const getListUserIdForInsurance = async () => {
  let listInsuranceIdCreated: Array<string> = [];
  let listUserId: Array<string> = [];

  const insuranceDocs = await getDocs(collection(firestoreDb, 'insurance'));
  const userDocs = await getDocs(collection(firestoreDb, 'user'));

  insuranceDocs.forEach((doc) => {
    listInsuranceIdCreated.push(doc.data()?.userId);
  });

  userDocs.forEach((doc) => {
    listUserId.push(doc.data()?.id);
  });

  return listUserId.filter(
    (userId) => !listInsuranceIdCreated.includes(userId)
  );
};

const requestCreateNewInsurance = async (data: any) => {
  let dataCreate = {
    ...data,
    timeCreate: Timestamp.fromDate(moment(data.timeCreate).toDate()),
    note: ''
  };
  
  await addDoc(collection(firestoreDb, 'insurance'), dataCreate);
};

export default {
  generateNewUserData,
  getUserDetail,
  requestLogin,
  upadteUserData,
  changeUserStatus,
  createNewUser,
  removeUser,
  requestChangePass,
  getListUserIdForInsurance,
  requestCreateNewInsurance,
};
