(define-private (ahoy)
    "Ahoy!"
)

(define-private (move-forward)
    (begin
        (print "@ACTION@: move-forward")
        true
    )
)

(define-private (turn-left)
    (begin
        (print "@ACTION@: turn-left")
        true
    )
)

(define-private (turn-right)
    (begin
        (print "@ACTION@: turn-right")
        true
    )
)

(define-private (collect)
    (begin
        (print "@ACTION@: collect-coin")
        true
    )
)

(define-private (fight)
    (begin
        (print "@ACTION@: fight")
        true
    )
)
