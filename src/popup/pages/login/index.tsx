import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);

  const btnClick = () => {
    // to create wallet
    console.log("click!2");
    // jump to dashboard
    navigate("/dashboard");
  };

  const verify = (e: React.ChangeEvent<HTMLInputElement>) => {
    // to verify
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (password) {
      if (true) {
        // to verify
        setDisabled(false);
      }
    }
  }, [password]);

  return (
    <div className="flex justify-center pt-60">
      <div className="flex-col">
        <div className="flex justify-center mb-8 gap-x-4">
          <img className="select-none w-15 h-12_5" src="./images/Diamond.svg" />
          <img src="./images/Paragon.svg" className="select-none" alt="" />
        </div>
        <div className="grid gap-5">
          <div className="text-2xl text-center text-white">
            Enter your password
          </div>
          <div>
            <Input.Password placeholder="Password" onChange={verify} />
          </div>
          <div>
            <Button
              disabled={disabled}
              size="large"
              type="primary"
              className="box w380 content"
              onClick={btnClick}
            >
              {t("Unlock")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
