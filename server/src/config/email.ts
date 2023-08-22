import sendgrid from "@sendgrid/mail";
import {reqEnv} from "../lib/env";

export default function() { sendgrid.setApiKey(reqEnv("SENDGRID_API_KEY")); }
