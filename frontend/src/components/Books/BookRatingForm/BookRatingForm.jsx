import * as PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './BookRatingForm.module.css';
import { generateStarsInputs, displayStars } from '../../../lib/functions';
import { APP_ROUTES } from '../../../utils/constants';
import { useUser } from '../../../lib/customHooks';
import { rateBook } from '../../../lib/common';

function BookRatingForm({
  grade, setRating, userId, setBook, id, userRated,
}) {
  const { connectedUser, auth } = useUser();
  const navigate = useNavigate();
  const { register, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      grade: 0,
    },
  });
  useEffect(() => {
    if (formState.dirtyFields.grade) {
      const rate = document.querySelector('input[name="grade"]:checked').value;
      setRating(parseInt(rate, 10));
      formState.dirtyFields.grade = false;
    }
  }, [formState]);
  const onSubmit = async () => {
    if (!connectedUser || !auth) {
      navigate(APP_ROUTES.SIGN_IN);
    }
    const update = await rateBook(id, userId, grade);
    console.log(update);
    if (update) {
      // eslint-disable-next-line no-underscore-dangle
      setBook({ ...update, id: update._id });
    } else {
      alert(update);
    }
  };
  return (
    <div className={styles.BookRatingForm}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>{grade > 0 ? 'Votre Note' : 'Notez cet ouvrage'}</p>
        <div className={styles.Stars}>
          {!userRated ? generateStarsInputs(grade, register) : displayStars(grade)}
        </div>
        {!userRated ? <button type="submit">Valider</button> : null}
      </form>
    </div>
  );
}

BookRatingForm.propTypes = {
  grade: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  setBook: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  userRated: PropTypes.bool.isRequired,
};

export default BookRatingForm;
