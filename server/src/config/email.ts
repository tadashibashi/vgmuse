import sendgrid from "@sendgrid/mail";
import {reqEnv} from "../utilities/env";

export default function() { sendgrid.setApiKey(reqEnv("SENDGRID_API_KEY")); }
