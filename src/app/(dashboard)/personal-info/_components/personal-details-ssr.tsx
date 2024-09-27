import { api } from "~/trpc/server";
import {
  addContactDetail,
  addEducation,
  addLanguage,
  addReference,
  deleteContactDetail,
  deleteEducation,
  deleteLanguage,
  deleteReference,
  updateContactDetail,
  updateEducation,
  updateLanguage,
  updateReference,
} from "../_actions/personalDetails";
import PersonalDetails from "./personal-details";

export async function PersonalDetailsSSR() {
  const [contactDetails, educations, languages, references] = await Promise.all(
    [
      api.user.getContactDetails(),
      api.user.getEducations(),
      api.user.getLanguages(),
      api.user.getReferences(),
    ],
  );

  return (
    <PersonalDetails
      addContactDetail={addContactDetail}
      updateContactDetail={updateContactDetail}
      deleteContactDetail={deleteContactDetail}
      addEducation={addEducation}
      updateEducation={updateEducation}
      deleteEducation={deleteEducation}
      addLanguage={addLanguage}
      updateLanguage={updateLanguage}
      deleteLanguage={deleteLanguage}
      addReference={addReference}
      updateReference={updateReference}
      deleteReference={deleteReference}
      initialState={{
        contactDetails,
        educations,
        languages,
        references,
      }}
    />
  );
}
