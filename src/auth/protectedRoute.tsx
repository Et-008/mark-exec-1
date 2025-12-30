import {
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
  TextInput,
  ButtonGroup,
  Checkbox,
  Label,
} from "flowbite-react";
import { useUserStore } from "../stores";
import React, { useState } from "react";
import { toast } from "react-toastify";

const API_URL = process.env.API_URL;

function ProtectedRoute({
  element,
}: {
  element: React.ReactElement;
}): React.ReactElement | null {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) {
    return <UserSignInSignUp />;
  }
  return element;
}

export default ProtectedRoute;

function UserSignInSignUp() {
  const [showModal, setShowModal] = useState<"login" | "signup" | null>(null);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-2xl font-bold">You need an account to continue</h1>
      <Button
        onClick={() => {
          setShowModal("signup");
        }}
        color="lime"
      >
        Login or Create Account
      </Button>
      {showModal && (
        <LoginModal onClose={() => setShowModal(null)} type={showModal} />
      )}
    </div>
  );
}

function LoginModal({
  onClose,
  type: initialType,
}: {
  onClose: () => void;
  type: "login" | "signup" | null;
}) {
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState<"login" | "signup" | null>(initialType);

  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = {
      ...form,
      [e.target.name]:
        e.target.name === "rememberMe" ? e.target.checked : e.target.value,
    };
    if (e.target.name === "email") {
      input.username = e.target.value.split("@")?.[0];
    }
    setForm(input);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(form);
    const input = { ...form };
    delete input.rememberMe;
    fetch(`${API_URL}/auth/${type}/`, {
      method: "POST",
      body: JSON.stringify(input),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.user) {
          setUser(data.user);
          onClose();
        } else {
          toast.error(data.detail);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  return (
    <Modal show={true} onClose={onClose} size="lg">
      <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
        <p className="text-2xl font-bold text-lime-600">
          {type === "login" ? "Login" : "Signup"}
        </p>
      </ModalHeader>
      <ModalBody className="grid grid-cols-1 gap-2">
        {type === "signup" && (
          <TextInput
            type="text"
            placeholder="Username"
            className="w-full"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        )}
        <TextInput
          type="email"
          placeholder="Email"
          className="w-full"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          placeholder="Password"
          className="w-full"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <div className="flex flex-row gap-2">
          <Checkbox
            id="remember-me"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleChange}
          />
          <Label htmlFor="remember-me" className="text-sm">
            Remember me
          </Label>
        </div>
        <div className="flex flex-row gap-2">
          {/* <Button
            color="alternative"
            onClick={onClose}
            className="ml-auto"
            disabled={isLoading}
          >
            Cancel
          </Button> */}
          <Button
            color="lime"
            onClick={handleSubmit}
            disabled={isLoading}
            className="ml-auto"
          >
            {isLoading ? "Loading..." : type === "login" ? "Login" : "Signup"}
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          {type === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <a
            href="#"
            className="text-blue-500 hover:underline"
            onClick={() => setType(type === "login" ? "signup" : "login")}
          >
            {" "}
            {type === "login" ? "Signup" : "Login"}
          </a>
        </p>
      </ModalBody>
    </Modal>
  );
}
